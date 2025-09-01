import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkout } from "@/hooks/use-workout";
import { User, Trophy, Target, Calendar, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Profile = () => {
  const { workoutHistory } = useWorkout();
  const { isAuthenticated, user, signOut } = useAuth();

  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((total, session) => total + session.sets.length, 0);
  const thisWeek = workoutHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
            <p className="text-sm text-spotify-green">{isAuthenticated ? (user?.email || "Usuário") : "Convidado"}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-4">
        <Card className="bg-gradient-card border-border p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Estatísticas</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-6 w-6 text-spotify-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalWorkouts}</div>
              <div className="text-sm text-muted-foreground">Treinos</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="h-6 w-6 text-spotify-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalSets}</div>
              <div className="text-sm text-muted-foreground">Séries</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="h-5 w-5 text-spotify-green" />
            <h3 className="font-medium text-foreground">Esta Semana</h3>
          </div>
          <div className="text-2xl font-bold text-spotify-green mb-1">{thisWeek}</div>
          <div className="text-sm text-muted-foreground">treinos realizados</div>
        </Card>

        <Card className="bg-gradient-card border-border p-4">
          <h3 className="font-medium text-foreground mb-3">Configurações</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border hover:bg-spotify-surface">
              Editar Perfil
            </Button>
            <Button variant="outline" className="w-full justify-start border-border hover:bg-spotify-surface">
              Configurações do App
            </Button>
            {isAuthenticated ? (
              <Button onClick={signOut} variant="destructive" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" /> Sair
              </Button>
            ) : (
              <Button asChild className="w-full justify-start bg-gradient-primary">
                <a href="/login"><LogIn className="h-4 w-4 mr-2" /> Entrar</a>
              </Button>
            )}
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;