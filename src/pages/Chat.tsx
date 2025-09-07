import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useChat } from "@/hooks/use-chat";
import { useUserSearch } from "@/hooks/use-user-search";
import { useAuth } from "@/hooks/use-auth";
import { Send, MessageCircle, ImagePlus, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { user } = useAuth();
  const { peers, selectedPeerId, setSelectedPeerId, getConversation, sendMessage, uploadImage } = useChat();
  const { users, loading: searching, searchUsers, clearUsers } = useUserSearch();
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const conversation = useMemo(() => (selectedPeerId ? getConversation(selectedPeerId) : []), [selectedPeerId, getConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.length]);

  const handleSend = async () => {
    if (!selectedPeerId || !message.trim()) return;
    const { error } = await sendMessage(selectedPeerId, message.trim());
    if (error) {
      toast({ title: "Falha ao enviar", description: error, variant: "destructive" });
      return;
    }
    setMessage("");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedPeerId) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Erro", description: "Por favor, selecione apenas imagens", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ title: "Erro", description: "Imagem muito grande. Máximo 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const { url, error } = await uploadImage(file);
      if (error) {
        toast({ title: "Erro no upload", description: error, variant: "destructive" });
        return;
      }
      
      if (url) {
        const { error: sendError } = await sendMessage(selectedPeerId, "📷 Foto enviada", url);
        if (sendError) {
          toast({ title: "Falha ao enviar", description: sendError, variant: "destructive" });
        }
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-spotify-green" />
          Chat
        </h1>

        <Card className="p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                placeholder="Buscar usuário pelo nome ou email"
                value={search}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearch(v);
                  if (v.trim().length === 0) clearUsers();
                  else searchUsers(v);
                }}
              />
              {users.length > 0 && (
                <div className="mt-2 border border-border rounded-md divide-y divide-border">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      className="w-full text-left p-2 hover:bg-spotify-surface"
                      onClick={() => {
                        setSelectedPeerId(u.id);
                        setSearch("");
                        clearUsers();
                      }}
                    >
                      {u.full_name || u.email}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 md:col-span-1">
            <h2 className="font-semibold mb-3">Conversas</h2>
            <div className="space-y-1 max-h-80 overflow-auto">
              {peers.map((p: any) => (
                <button
                  key={p.peerId}
                  className={`w-full text-left p-2 rounded-md hover:bg-spotify-surface ${selectedPeerId === p.peerId ? "bg-spotify-surface" : ""}`}
                  onClick={() => setSelectedPeerId(p.peerId)}
                >
                  <div className="text-sm font-medium">{p.email || p.peerId}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.lastMessage}</div>
                </button>
              ))}
              {peers.length === 0 && (
                <div className="text-sm text-muted-foreground">Nenhuma conversa</div>
              )}
            </div>
          </Card>

          <Card className="p-4 md:col-span-2 flex flex-col h-[60vh]">
            <div className="flex-1 overflow-auto space-y-2">
              {selectedPeerId ? (
                conversation.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] p-2 rounded-lg ${m.sender_id === user?.id ? "bg-spotify-green text-white" : "bg-spotify-surface"}`}>
                      {m.image_url ? (
                        <div className="space-y-2">
                          <img 
                            src={m.image_url} 
                            alt="Imagem enviada" 
                            className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(m.image_url!, '_blank')}
                          />
                          {m.content && (
                            <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                      )}
                      <div className="text-[10px] opacity-70 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">Selecione um usuário para começar</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Digite uma mensagem"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                disabled={!selectedPeerId || uploading}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={!selectedPeerId || uploading}
                variant="outline"
                size="icon"
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-spotify-green"></div>
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={handleSend} disabled={!selectedPeerId || !message.trim() || uploading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Chat;

