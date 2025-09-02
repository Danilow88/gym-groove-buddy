import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useAppointments } from "@/hooks/use-appointments";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Calendar as CalendarIcon, CheckCircle, XCircle } from "lucide-react";

const Schedule = () => {
  const { available, mine, loading, book, cancel, createSlot, approve } = useAppointments();
  const { isAdminUser, isAdminAuthenticated } = useAdminAuth();
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [meetingUrl, setMeetingUrl] = useState<string>("");

  const pending = useMemo(() => mine.filter((a) => a.status === "pending"), [mine]);
  const approved = useMemo(() => mine.filter((a) => a.status === "approved"), [mine]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-spotify-green" />
          Agenda de Videoaulas
        </h1>

        {isAdminUser && isAdminAuthenticated && (
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Criar horário (admin)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
              <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
              <Button
                onClick={async () => {
                  if (!start || !end) return;
                  await createSlot(new Date(start), new Date(end));
                  setStart("");
                  setEnd("");
                }}
                disabled={!start || !end}
              >
                Criar slot
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Disponíveis</h2>
            <div className="space-y-2">
              {available.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-2 rounded-md bg-spotify-surface">
                  <div className="text-sm">
                    {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleTimeString()}
                  </div>
                  <Button size="sm" onClick={() => book(slot.id)} disabled={loading}>Reservar</Button>
                </div>
              ))}
              {available.length === 0 && (
                <div className="text-sm text-muted-foreground">Sem horários disponíveis</div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold mb-3">Minhas aulas</h2>
            <div className="space-y-3">
              {pending.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Pendentes</div>
                  <div className="space-y-2">
                    {pending.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-2 rounded-md bg-spotify-surface">
                        <div className="text-sm">
                          {new Date(a.start_time).toLocaleString()} - {new Date(a.end_time).toLocaleTimeString()}
                        </div>
                        <div className="flex gap-2">
                          {isAdminUser && isAdminAuthenticated && (
                            <>
                              <Input
                                placeholder="Link da reunião"
                                value={meetingUrl}
                                onChange={(e) => setMeetingUrl(e.target.value)}
                                className="w-40"
                              />
                              <Button size="sm" variant="default" onClick={() => approve(a.id, meetingUrl)}>
                                <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => cancel(a.id)}>
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
                  <div className="text-sm font-medium mb-2">Aprovadas</div>
                  <div className="space-y-2">
                    {approved.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-2 rounded-md bg-spotify-surface">
                        <div className="text-sm">
                          {new Date(a.start_time).toLocaleString()} - {new Date(a.end_time).toLocaleTimeString()}
                        </div>
                        {a.meeting_url && (
                          <a className="text-spotify-green text-sm underline" href={a.meeting_url} target="_blank" rel="noreferrer">
                            Entrar
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pending.length === 0 && approved.length === 0 && (
                <div className="text-sm text-muted-foreground">Nenhuma reserva</div>
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

