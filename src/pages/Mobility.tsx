import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useMobility } from "@/hooks/use-mobility";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { StretchHorizontal } from "lucide-react";

const Mobility = () => {
  const { items, loading, create, remove } = useMobility();
  const { isAdminUser, isAdminAuthenticated } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | undefined>(undefined);

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
                  <div className="font-semibold">{ex.title}</div>
                  {ex.difficulty && (
                    <div className="text-xs text-muted-foreground capitalize">{ex.difficulty}</div>
                  )}
                </div>
                {canManage && (
                  <Button variant="destructive" size="sm" onClick={() => remove(ex.id)}>Excluir</Button>
                )}
              </div>
              {ex.description && <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{ex.description}</div>}
              {ex.video_url && (
                <a className="text-sm text-spotify-green underline mt-2 inline-block" href={ex.video_url} target="_blank" rel="noreferrer">
                  Ver vídeo
                </a>
              )}
            </Card>
          ))}
          {items.length === 0 && !loading && (
            <div className="text-sm text-muted-foreground">Nenhum exercício cadastrado</div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Mobility;

