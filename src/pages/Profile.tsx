import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyPlanView } from "@/components/workout/weekly-plan-view";
import { useWorkout } from "@/hooks/use-workout";
import { useAdmin } from "@/hooks/use-admin";
import { User, Trophy, Target, Calendar, LogOut, LogIn, Heart, Dumbbell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const { workoutHistory, exercises } = useWorkout();
  const { isAuthenticated, user, signOut } = useAuth();
  const { getWorkoutPlansForUser } = useAdmin();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((total, session) => total + session.sets.length, 0);
  const thisWeek = workoutHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  }).length;

  const myWorkoutPlans = user ? getWorkoutPlansForUser(user.id) : [];

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.name || 'Exercício desconhecido';
  };

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

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Estatísticas</TabsTrigger>
            <TabsTrigger value="weekly">Plano Semanal</TabsTrigger>
            <TabsTrigger value="plans">Meus Planos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="weekly">
            <div className="text-center p-8">
              <h3 className="text-lg font-semibold mb-2">Plano Semanal (Em manutenção)</h3>
              <p className="text-muted-foreground">Funcionalidade temporariamente desabilitada</p>
            </div>
          </TabsContent>

          <TabsContent value="plans">
            {myWorkoutPlans.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-spotify-green" />
                  Planos Criados pela Yara ({myWorkoutPlans.length})
                </h2>
                {myWorkoutPlans.map((plan) => (
                  <Card key={plan.id} className="bg-gradient-card border-border p-4">
                    <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-spotify-green" />
                      {plan.name}
                    </h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      {plan.exercises.length} exercícios
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {plan.exercises.map(id => getExerciseName(id)).slice(0, 3).join(', ')}
                      {plan.exercises.length > 3 && `, +${plan.exercises.length - 3} outros`}
                    </div>
                    {plan.observations && (
                      <div className="bg-spotify-surface p-3 rounded border border-border mt-3">
                        <p className="text-sm text-foreground">
                          <strong>Observações da Yara:</strong>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.observations}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Criado em: {plan.createdAt.toLocaleDateString('pt-BR')}
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-card border-border p-6 text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum Plano Criado</h3>
                <p className="text-muted-foreground">Solicite à Yara para criar planos de treino personalizados!</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-card border-border p-4">
          <h3 className="font-medium text-foreground mb-3">Configurações</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-spotify-surface rounded-md p-3 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Tema</p>
                <p className="text-xs text-muted-foreground">Claro ou escuro (segue o sistema por padrão)</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Claro</span>
                <Switch
                  checked={(theme ?? resolvedTheme) === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  aria-label="Alternar tema escuro"
                />
                <span className="text-xs text-muted-foreground">Escuro</span>
              </div>
            </div>
            {/* Planner removido: planejamento agora é feito em Treino */}
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