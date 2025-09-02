import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Send } from 'lucide-react';

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  content: string;
  created_at: string;
};

const ADMIN_EMAIL = 'yaraka78@gmail.com';

export default function Chat() {
  const { user } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    }, 0);
  };

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let adminId: string | null = null;
      const { data: admins } = await supabase.from('admin_configs').select('*');
      if (admins && admins.length > 0) {
        const { data: adminUser } = await supabase.from('users').select('id, email').eq('email', ADMIN_EMAIL).maybeSingle();
        adminId = (adminUser as any)?.id || null;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: true });
      if (!error && data) setMessages(data as Message[]);
      scrollToBottom();
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [user?.id]);

  const send = async () => {
    if (!user || !input.trim()) return;
    try {
      // try to resolve admin id by email
      let adminRecipient: string | null = null;
      const { data: adminUser } = await supabase.from('users').select('id, email').eq('email', ADMIN_EMAIL).maybeSingle();
      adminRecipient = (adminUser as any)?.id || null;

      const payload = { sender_id: user.id, recipient_id: adminRecipient, content: input.trim() };
      const optimistic: Message = { id: Math.random().toString(36).slice(2), sender_id: user.id, recipient_id: adminRecipient, content: input.trim(), created_at: new Date().toISOString() };
      setMessages(prev => [...prev, optimistic]);
      setInput('');
      const { error } = await supabase.from('chat_messages').insert([payload]);
      if (error) throw error;
      await load();
    } catch {
      toast({ title: 'Falha ao enviar', description: 'Tente novamente.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><MessageCircle className="h-5 w-5 text-spotify-green"/>Chat</h1>
            <p className="text-sm text-muted-foreground">Converse com a Yara</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Card className="p-0 overflow-hidden">
          <div ref={listRef} className="h-[60vh] overflow-y-auto p-4 space-y-2 bg-spotify-surface">
            {messages.map((m) => {
              const mine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded px-3 py-2 text-sm ${mine ? 'bg-spotify-green text-white' : 'bg-background text-foreground border border-border'}`}>
                    {m.content}
                    <div className="text-[10px] opacity-70 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-3 border-t border-border flex items-center gap-2 bg-spotify-card">
            <Input
              placeholder="Digite sua mensagem"
              value={input}
              onChange={(e)=> setInput(e.target.value)}
              onKeyDown={(e)=> { if (e.key === 'Enter') send(); }}
              className="bg-spotify-surface border-border"
            />
            <Button onClick={send} className="bg-spotify-green hover:bg-spotify-green-hover"><Send className="h-4 w-4"/></Button>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}

