import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useAppointments } from "@/hooks/use-appointments";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

function toLocalDateKey(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
}

const Schedule = () => {
  const { available, mine, loading, book, cancel, createSlot, approve, propose } = useAppointments();
  const { isAdminUser, isAdminAuthenticated } = useAdminAuth();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [meetingUrl, setMeetingUrl] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const pending = useMemo(() => mine.filter((a) => a.status === "booked"), [mine]);
  const approved = useMemo(() => mine.filter((a) => a.status === "available" && a.meeting_url), [mine]);

  const availableByDate = useMemo(() => {
    const map = new Map<string, typeof available>();
    for (const slot of available) {
      const key = toLocalDateKey(slot.start_time);
      const list = map.get(key) || [];
      list.push(slot);
      map.set(key, list);
    }
    return map;
  }, [available]);

  const filteredAvailable = useMemo(() => {
    if (!selectedDate) return available;
    const key = toLocalDateKey(selectedDate);
    return availableByDate.get(key) || [];
  }, [selectedDate, available, availableByDate]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`appointments-approvals-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'appointments', filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          const newStatus = payload?.new?.status;
          if (newStatus === 'approved') {
            toast({
              title: 'Aula aprovada!',
              description: 'Sua videoaula foi aprovada. Acesse em Minhas aulas.',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, toast]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-spotify-green" />
          Agenda de Videoaulas
        </h1>

        {isAdminUser && isAdminAuthenticated && (
          <Card className="p-3 md:p-4">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Criar horário (admin)</h2>
            <div className="space-y-2 md:grid md:grid-cols-3 md:gap-2 md:space-y-0">
              <Input 
                type="datetime-local" 
                value={start} 
                onChange={(e) => setStart(e.target.value)}
                className="text-sm"
              />
              <Input 
                type="datetime-local" 
                value={end} 
                onChange={(e) => setEnd(e.target.value)}
                className="text-sm"
              />
              <Button
                onClick={async () => {
                  if (!start || !end) return;
                  await createSlot(new Date(start), new Date(end));
                  setStart("");
                  setEnd("");
                }}
                disabled={!start || !end}
                className="w-full"
              >
                Criar slot
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-3 md:space-y-4">
          {/* Mobile: Stack vertically, Desktop: Grid layout */}
          <Card className="p-3 md:p-4">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Calendário</h2>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  available: (day: Date) => {
                    const key = toLocalDateKey(day);
                    return availableByDate.has(key);
                  },
                }}
                modifiersClassNames={{
                  available: "bg-spotify-green/20 text-spotify-green rounded-full",
                }}
                className="w-fit"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2 text-center md:text-left">
              Dias em verde possuem horários disponíveis.
            </div>
            {selectedDate && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs w-full md:w-auto"
                onClick={() => setSelectedDate(undefined)}
              >
                Limpar seleção
              </Button>
            )}
          </Card>

          <Card className="p-3 md:p-4">
            <h2 className="font-semibold mb-3 text-sm md:text-base">
              {selectedDate ? (
                <>Disponíveis em {selectedDate.toLocaleDateString()}</>
              ) : (
                <>Horários Disponíveis</>
              )}
            </h2>
            <div className="space-y-2">
              {filteredAvailable.map((slot) => (
                <div key={slot.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-spotify-surface">
                  <div className="text-sm font-medium">
                    <div>{new Date(slot.start_time).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(slot.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(slot.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => book(slot.id)} 
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    Agendar
                  </Button>
                </div>
              ))}
              {filteredAvailable.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Sem horários disponíveis
                </div>
              )}
            </div>
          </Card>

          <Card className="p-3 md:p-4">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Sugerir Horário</h2>
            <div className="space-y-2 md:grid md:grid-cols-3 md:gap-2 md:space-y-0">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Início</label>
                <Input 
                  type="datetime-local" 
                  value={start} 
                  onChange={(e) => setStart(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Fim</label>
                <Input 
                  type="datetime-local" 
                  value={end} 
                  onChange={(e) => setEnd(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={async () => {
                    if (!start || !end) return;
                    const { error } = await propose(new Date(start), new Date(end));
                    if (!error) {
                      setStart(""); setEnd("");
                      toast({ title: 'Pedido enviado', description: 'Aguarde aprovação do administrador.' });
                    } else {
                      toast({ title: 'Erro', description: error, variant: 'destructive' });
                    }
                  }} 
                  disabled={!start || !end}
                  className="w-full"
                >
                  Enviar Pedido
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              O administrador receberá e poderá aprovar seu pedido.
            </div>
          </Card>

          <Card className="p-3 md:p-4">
            <h2 className="font-semibold mb-3 text-sm md:text-base">Minhas Aulas</h2>
            <div className="space-y-4">
              {pending.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2 text-spotify-green">Pendentes de Aprovação</div>
                  <div className="space-y-2">
                    {pending.map((a) => (
                      <div key={a.id} className="p-3 rounded-lg bg-spotify-surface space-y-2">
                        <div className="text-sm font-medium">
                          <div>{new Date(a.start_time).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(a.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(a.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {isAdminUser && isAdminAuthenticated && (
                            <>
                              <Input
                                placeholder="Link da reunião"
                                value={meetingUrl}
                                onChange={(e) => setMeetingUrl(e.target.value)}
                                className="text-sm"
                              />
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={() => approve(a.id, meetingUrl)}
                                className="w-full sm:w-auto"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                              </Button>
                            </>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => cancel(a.id)}
                            className="w-full sm:w-auto"
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Cancelar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {approved.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2 text-spotify-green">Aprovadas</div>
                  <div className="space-y-2">
                    {approved.map((a) => (
                      <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-spotify-surface">
                        <div className="text-sm font-medium">
                          <div>{new Date(a.start_time).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(a.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(a.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        {a.meeting_url && (
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/call/${a.id}`)}
                            className="w-full sm:w-auto bg-spotify-green hover:bg-spotify-green/90"
                          >
                            Entrar na Aula
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pending.length === 0 && approved.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma aula agendada
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Schedule;