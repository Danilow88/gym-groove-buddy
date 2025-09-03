import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read_at?: string | null;
}

export function useChat() {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const [userIdToEmail, setUserIdToEmail] = useState<Record<string, string>>({});

  const peers = useMemo(() => {
    const unique = new Map<string, { peerId: string; lastMessageAt: string; lastMessage: string }>();
    for (const m of messages) {
      const peerId = m.sender_id === userId ? m.recipient_id : m.sender_id;
      const existing = unique.get(peerId);
      if (!existing || existing.lastMessageAt < m.created_at) {
        unique.set(peerId, { peerId, lastMessageAt: m.created_at, lastMessage: m.content });
      }
    }
    const arr = Array.from(unique.values()).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
    return arr.map((p) => ({ ...p, email: userIdToEmail[p.peerId] } as any));
  }, [messages, userId, userIdToEmail]);

  // Load emails for peers
  useEffect(() => {
    const ids = Array.from(
      new Set(
        messages
          .map((m) => (m.sender_id === userId ? m.recipient_id : m.sender_id))
          .filter(Boolean)
      )
    );
    if (ids.length === 0) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', ids);
        if (error) return;
        const map: Record<string, string> = {};
        for (const u of data || []) map[u.user_id] = u.full_name || 'Usuário';
        setUserIdToEmail((prev) => ({ ...prev, ...map }));
      } catch {}
    })();
  }, [messages, userId]);

  const loadMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, sender_id, recipient_id, content, created_at, read_at")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setMessages(data ? data.map(d => ({ ...d, id: String(d.id) })) : []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getConversation = useCallback(
    (peerId: string) => messages.filter(
      (m) =>
        (m.sender_id === userId && m.recipient_id === peerId) ||
        (m.sender_id === peerId && m.recipient_id === userId)
    ),
    [messages, userId]
  );

  const sendMessage = useCallback(
    async (recipientId: string, content: string) => {
      if (!userId || !content.trim()) return { error: "missing" };
      const { error } = await supabase.from("chat_messages").insert([
        { sender_id: userId, recipient_id: recipientId, content }
      ]);
      if (error) return { error: error.message };
      return { error: null };
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) return;
    loadMessages();
    // subscribe to realtime INSERTs and append locally (menos latência)
    const channel = supabase.channel("chat_messages_changes");
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_messages" },
      (payload: any) => {
        const m = payload?.new as ChatMessage | undefined;
        if (!m) return;
        if (m.sender_id === userId || m.recipient_id === userId) {
          setMessages((prev) => {
            // evitar duplicata: se já existir id, retorna prev
            if (prev.some((p) => p.id === m.id)) return prev;
            const next = [...prev, m];
            next.sort((a, b) => a.created_at.localeCompare(b.created_at));
            return next;
          });
        }
      }
    );
    channel.subscribe();
    channelRef.current = channel;
    return () => {
      channelRef.current?.unsubscribe();
      channelRef.current = null;
    };
  }, [userId, loadMessages]);

  return {
    loading,
    error,
    messages,
    peers,
    selectedPeerId,
    setSelectedPeerId,
    getConversation,
    sendMessage,
    reload: loadMessages,
    userIdToEmail,
  };
}

