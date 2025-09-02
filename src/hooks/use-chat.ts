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

  const peers = useMemo(() => {
    const unique = new Map<string, { peerId: string; lastMessageAt: string; lastMessage: string }>();
    for (const m of messages) {
      const peerId = m.sender_id === userId ? m.recipient_id : m.sender_id;
      const existing = unique.get(peerId);
      if (!existing || existing.lastMessageAt < m.created_at) {
        unique.set(peerId, { peerId, lastMessageAt: m.created_at, lastMessage: m.content });
      }
    }
    return Array.from(unique.values()).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  }, [messages, userId]);

  const loadMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await (supabase as any)
        .from("chat_messages")
        .select("id, sender_id, recipient_id, content, created_at, read_at")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setMessages(data as ChatMessage[]);
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
      const { error } = await (supabase as any).from("chat_messages").insert([
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
    // subscribe to realtime changes
    const channel = supabase.channel("chat_messages_changes");
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `sender_id=eq.${userId}`,
      },
      () => loadMessages()
    );
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `recipient_id=eq.${userId}`,
      },
      () => loadMessages()
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
  };
}

