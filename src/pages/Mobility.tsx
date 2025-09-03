import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useMobility } from "@/hooks/use-mobility";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { StretchHorizontal, Play } from "lucide-react";
import { VideoModal } from "@/components/workout/video-modal";
import { CountdownTimer } from "@/components/timer/countdown-timer";

const Mobility = () => {
  const { items, loading, create, remove, update, upload } = useMobility();
  const { isAdminUser, isAdminAuthenticated } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | undefined>(undefined);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const canManage = isAdminUser && isAdminAuthenticated;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <StretchHorizontal className="h-6 w-6 text-spotify-green" />
          Exercícios de Mobilidade
        </h1>

        {canManage && (
          <Card className="p-4">
            <h2 className="font-semibold mb-3">Adicionar exercício</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Select onValueChange={(v) => setDifficulty(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="URL do vídeo (opcional)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
              <div className="md:col-span-2">
                <Textarea placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Button
                  onClick={async () => {
                    if (!title.trim()) return;
                    await create({ title: title.trim(), description: description.trim() || undefined, video_url: videoUrl.trim() || undefined, difficulty });
                    setTitle(""); setDescription(""); setVideoUrl(""); setDifficulty(undefined);
                  }}
                  disabled={!title.trim()}
                >
                  Salvar
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((ex) => (
            <Card key={ex.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    {canManage ? (
                      <input
                        className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm w-full"
                        defaultValue={ex.title}
                        onBlur={(e)=> update(ex.id, { title: e.target.value })}
                      />
                    ) : (
                      ex.title
                    )}
                  </div>
                  {ex.difficulty && (
                    <div className="text-xs text-muted-foreground capitalize">{ex.difficulty}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {ex.video_url && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => { setVideoTitle(ex.title); setVideoSrc(ex.video_url!); setVideoOpen(true); }}
                      className="bg-spotify-green"
                    >
                      <Play className="h-4 w-4 mr-1" /> Vídeo
                    </Button>
                  )}
                  {canManage && (
                  <Button variant="destructive" size="sm" onClick={() => remove(ex.id)}>Excluir</Button>
                  )}
                </div>
              </div>
              {ex.description && <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{ex.description}</div>}
              {canManage && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    className="rounded bg-spotify-surface border border-border px-2 py-1 text-sm"
                    placeholder="URL do vídeo"
                    defaultValue={ex.video_url || ''}
                    onBlur={(e)=> update(ex.id, { video_url: e.target.value })}
                  />
                  <label className="text-xs text-foreground/80 inline-flex items-center gap-2">
                    <span>Upload vídeo:</span>
                    <input type="file" accept="video/*" onChange={async (e)=> { const f=e.target.files?.[0]; if (f) await upload(ex.id, f); }} />
                  </label>
                </div>
              )}
              <div className="mt-3">
                <CountdownTimer label="Cronômetro de mobilidade" defaultSeconds={60} minSeconds={15} maxSeconds={300} step={5} />
              </div>
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="text-sm text-muted-foreground">Nenhum exercício cadastrado</div>
          )}
        </div>
        <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} exerciseName={videoTitle} videoUrl={videoSrc} />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Mobility;

