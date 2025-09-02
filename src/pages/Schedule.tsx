import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useAuth } from '@/hooks/use-auth';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Video, Check, X } from 'lucide-react';

type Appointment = {
  id: string;
  admin_id: string;
  user_id: string | null;
  start_time: string;
  end_time: string;
  status: 'available' | 'requested' | 'approved' | 'cancelled';
  meeting_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

const formatDateTimeLocal = (date: Date) => {
  const iso = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
};

export default function Schedule() {
  const { user } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [date, setDate] = useState<string>(formatDateTimeLocal(new Date()));
  const [duration, setDuration] = useState<number>(60);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('appointments').select('*').order('start_time', { ascending: true });
      if (error) throw error;
      setAppointments(data as Appointment[]);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createSlot = async () => {
    if (!user || !isAdminAuthenticated) return;
    setCreating(true);
    try {
      const start = new Date(date);
      const end = new Date(start.getTime() + Math.min(Math.max(duration, 15), 60) * 60000);
      const payload = { admin_id: user.id, start_time: start.toISOString(), end_time: end.toISOString(), status: 'available' as const };
      const { data, error } = await supabase.from('appointments').insert([payload]).select('*').single();
      if (error) throw error;
      setAppointments(prev => [...prev, data as Appointment].sort((a,b)=> a.start_time.localeCompare(b.start_time)));
      toast({ title: 'Slot criado', description: 'Horário disponível adicionado.' });
    } catch (e) {
      toast({ title: 'Erro ao criar slot', description: 'Verifique conflitos e tente novamente.', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const request = async (id: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'requested', user_id: user.id })
        .eq('id', id)
        .eq('status', 'available')
        .select('*')
        .single();
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? (data as Appointment) : a));
      toast({ title: 'Solicitação enviada', description: 'Aguardando aprovação do admin.' });
    } catch (e) {
      toast({ title: 'Não foi possível reservar', description: 'Slot pode ter sido reservado por outra pessoa.', variant: 'destructive' });
    }
  };

  const cancel = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? (data as Appointment) : a));
      toast({ title: 'Slot cancelado', description: 'Horário marcado como cancelado.' });
    } catch {}
  };

  const approve = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'approved' })
        .eq('id', id)
        .eq('status', 'requested')
        .select('*')
        .single();
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? (data as Appointment) : a));
      toast({ title: 'Agendamento aprovado', description: 'O horário foi confirmado.' });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Video className="h-5 w-5 text-spotify-green"/>Agenda de Aulas</h1>
            <p className="text-sm text-muted-foreground">Agende aulas de até 1 hora com a Yara</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {isAdminAuthenticated && (
          <Card className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Criar horário disponível</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-sm text-foreground mb-1 block">Início</label>
                <Input type="datetime-local" value={date} onChange={(e)=> setDate(e.target.value)} className="bg-spotify-surface border-border" />
              </div>
              <div>
                <label className="text-sm text-foreground mb-1 block">Duração</label>
                <Select value={String(duration)} onValueChange={(v)=> setDuration(Number(v))}>
                  <SelectTrigger className="bg-spotify-surface border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-spotify-card border-border">
                    {[30, 45, 60].map((m)=> (<SelectItem key={m} value={String(m)}>{m} min</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={createSlot} disabled={creating} className="bg-spotify-green hover:bg-spotify-green-hover w-full">Criar</Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-spotify-green"/>Próximos horários</h2>
          <div className="space-y-2">
            {appointments.length === 0 && (
              <div className="text-sm text-muted-foreground">Sem horários cadastrados.</div>
            )}
            {appointments.map((a) => {
              const start = new Date(a.start_time);
              const end = new Date(a.end_time);
              const label = `${start.toLocaleString()} - ${end.toLocaleTimeString()}`;
              const isMine = user?.id && a.user_id === user.id;
              return (
                <div key={a.id} className="bg-spotify-surface border border-border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="text-foreground text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-spotify-green"/>{label}</div>
                    <div className="text-xs text-muted-foreground">Status: {a.status}{a.user_id ? ` • Reservado por: ${isMine ? 'você' : a.user_id}` : ''}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.status === 'available' && user && (
                      <Button size="sm" className="bg-spotify-green" onClick={()=> request(a.id)}>
                        <Check className="h-4 w-4 mr-1"/> Solicitar
                      </Button>
                    )}
                    {isAdminAuthenticated && a.status === 'requested' && (
                      <Button size="sm" className="bg-spotify-green" onClick={()=> approve(a.id)}>
                        <Check className="h-4 w-4 mr-1"/> Aprovar
                      </Button>
                    )}
                    {isAdminAuthenticated && a.status !== 'cancelled' && (
                      <Button size="sm" variant="destructive" onClick={()=> cancel(a.id)}>
                        <X className="h-4 w-4 mr-1"/> Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}

