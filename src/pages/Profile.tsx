import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyPlanView } from "@/components/workout/weekly-plan-view";
import { useWorkout } from "@/hooks/use-workout";
import { useAdmin } from "@/hooks/use-admin";
import { User, Trophy, Target, Calendar, LogOut, LogIn, Heart, Dumbbell, Play, Timer as TimerIcon, Save, Activity, TrendingUp, Weight, Ruler, Edit } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { VideoModal } from "@/components/workout/video-modal";
import { CountdownTimer } from "@/components/timer/countdown-timer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { workoutHistory, exercises } = useWorkout();
  const { isAuthenticated, user, signOut } = useAuth();
  const { getWorkoutPlansForUser } = useAdmin();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  const [videoState, setVideoState] = useState<{ open: boolean; name: string; url: string }>({ open: false, name: '', url: '' });
  const [planInputs, setPlanInputs] = useState<Record<string, { sets?: number; weight?: number; rest?: number }>>({});
  const [restVisible, setRestVisible] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<{ weight?: number; height?: number; birth_date?: string }>({});
  const [editingProfile, setEditingProfile] = useState(false);

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

  const getExercise = (exerciseId: string) => exercises.find(ex => ex.id === exerciseId);

  const loadPlanSettings = (planId: string) => {
    try {
      const raw = localStorage.getItem(`plan_${planId}_settings`);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };

  const savePlanSettings = (planId: string, exerciseId: string) => {
    const key = `plan_${planId}_settings`;
    const existing = loadPlanSettings(planId);
    const cur = planInputs[`${planId}_${exerciseId}`] || {};
    existing[exerciseId] = {
      sets: Number(cur.sets) || 0,
      weight: Number(cur.weight) || 0,
      rest: Number(cur.rest) || 0,
    };
    try { localStorage.setItem(key, JSON.stringify(existing)); } catch {}
  };

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('weight, height, birth_date')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          weight: profile.weight,
          height: profile.height,
          birth_date: profile.birth_date
        });
      
      if (error) {
        toast({ title: "Erro", description: "Não foi possível salvar o perfil", variant: "destructive" });
      } else {
        toast({ title: "Sucesso", description: "Perfil atualizado com sucesso!" });
        setEditingProfile(false);
      }
    } catch (err) {
      toast({ title: "Erro", description: "Erro inesperado ao salvar", variant: "destructive" });
    }
  };

  const calculateBMI = () => {
    if (!profile.weight || !profile.height) return null;
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  const calculateAge = () => {
    if (!profile.birth_date) return null;
    const today = new Date();
    const birthDate = new Date(profile.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Estatísticas</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
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

            {/* Dados Pessoais */}
            <Card className="bg-gradient-card border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-spotify-green" />
                  <h3 className="font-medium text-foreground">Dados Pessoais</h3>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingProfile(!editingProfile)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              {editingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight" className="text-sm font-medium">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={profile.weight || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) || undefined }))}
                        placeholder="Ex: 70.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-sm font-medium">Altura (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={profile.height || ''}
                        onChange={(e) => setProfile(prev => ({ ...prev, height: parseFloat(e.target.value) || undefined }))}
                        placeholder="Ex: 175"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="birth_date" className="text-sm font-medium">Data de Nascimento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={profile.birth_date || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, birth_date: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveProfile} className="bg-spotify-green">
                      <Save className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProfile(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-spotify-green" />
                    <span>{profile.weight ? `${profile.weight} kg` : 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-spotify-green" />
                    <span>{profile.height ? `${profile.height} cm` : 'Não informado'}</span>
                  </div>
                  {calculateBMI() && (
                    <div className="col-span-2 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-spotify-green" />
                      <span>IMC: {calculateBMI()}</span>
                    </div>
                  )}
                  {calculateAge() && (
                    <div className="col-span-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-spotify-green" />
                      <span>Idade: {calculateAge()} anos</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <Card className="bg-gradient-card border-border p-4">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-spotify-green" />
                Relatório de Progresso
              </h2>
              
              {/* Estatísticas de Progresso */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-spotify-surface rounded-lg">
                  <div className="text-2xl font-bold text-spotify-green">{totalWorkouts}</div>
                  <div className="text-sm text-muted-foreground">Total de Treinos</div>
                </div>
                <div className="text-center p-4 bg-spotify-surface rounded-lg">
                  <div className="text-2xl font-bold text-spotify-green">{totalSets}</div>
                  <div className="text-sm text-muted-foreground">Total de Séries</div>
                </div>
              </div>

              {/* Informações do Perfil */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Dados Físicos</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peso:</span>
                    <span className="font-medium">{profile.weight ? `${profile.weight} kg` : 'Não informado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Altura:</span>
                    <span className="font-medium">{profile.height ? `${profile.height} cm` : 'Não informado'}</span>
                  </div>
                  {calculateBMI() && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IMC:</span>
                      <span className="font-medium">{calculateBMI()}</span>
                    </div>
                  )}
                  {calculateAge() && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Idade:</span>
                      <span className="font-medium">{calculateAge()} anos</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumo de Atividade */}
              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-foreground">Resumo de Atividade</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Treinos esta semana:</span>
                    <span className="font-medium text-spotify-green">{thisWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Média por semana:</span>
                    <span className="font-medium">{totalWorkouts > 0 ? (totalWorkouts / Math.max(1, Math.ceil(workoutHistory.length / 7))).toFixed(1) : '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exercícios diferentes:</span>
                    <span className="font-medium">{new Set(workoutHistory.flatMap(session => session.sets.map(set => set.exerciseId))).size}</span>
                  </div>
                </div>
              </div>

              {/* Recomendações baseadas no perfil */}
              {(profile.weight || profile.height || calculateAge()) && (
                <div className="mt-6 p-4 bg-spotify-surface rounded-lg">
                  <h3 className="font-medium text-foreground mb-2">💡 Recomendações Personalizadas</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {calculateBMI() && (
                      <p>• Com seu IMC de {calculateBMI()}, mantenha uma rotina consistente de exercícios</p>
                    )}
                    {calculateAge() && calculateAge()! < 30 && (
                      <p>• Aproveite sua idade para focar em exercícios de força e resistência</p>
                    )}
                    {thisWeek < 3 && (
                      <p>• Tente aumentar a frequência para 3-4 treinos por semana</p>
                    )}
                  </div>
                </div>
              )}
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
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-spotify-green" />
                        {plan.name}
                      </h3>
                      <div className="text-xs text-muted-foreground">{plan.exercises.length} exercícios</div>
                    </div>

                    <div className="space-y-2">
                      {plan.exercises.map((id) => {
                        const ex = getExercise(id);
                        const key = `${plan.id}_${id}`;
                        const inp = planInputs[key] || {};
                        const adminDefaults = (plan as any).exerciseSettings?.[id] || {};
                        return (
                          <div key={id} className="bg-spotify-surface border border-border rounded p-3">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-foreground">{ex?.name || id}</div>
                              {ex?.videoUrl && (
                                <Button size="sm" className="bg-spotify-green" onClick={(e)=> { e.preventDefault(); setVideoState({ open: true, name: ex?.name || '', url: ex?.videoUrl || '' }); }}>
                                  <Play className="h-4 w-4 mr-1" /> Vídeo
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <div>
                                <div className="text-[10px] text-muted-foreground mb-1">Personal (séries)</div>
                                <input disabled className="w-full rounded bg-spotify-surface border border-border px-2 py-1 text-xs" value={adminDefaults.sets ?? ''} />
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground mb-1">Personal (peso)</div>
                                <input disabled className="w-full rounded bg-spotify-surface border border-border px-2 py-1 text-xs" value={adminDefaults.weight ?? ''} />
                              </div>
                              <div>
                                <div className="text-[10px] text-muted-foreground mb-1">Personal (descanso s)</div>
                                <input disabled className="w-full rounded bg-spotify-surface border border-border px-2 py-1 text-xs" value={adminDefaults.rest ?? ''} />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <input className="rounded bg-background border border-border px-2 py-1 text-sm" placeholder="Minhas Séries" type="number" value={inp.sets ?? ''} onChange={(e)=> setPlanInputs(prev=> ({ ...prev, [key]: { ...prev[key], sets: Number(e.target.value)||0 } }))} />
                              <input className="rounded bg-background border border-border px-2 py-1 text-sm" placeholder="Meu Peso (kg)" type="number" value={inp.weight ?? ''} onChange={(e)=> setPlanInputs(prev=> ({ ...prev, [key]: { ...prev[key], weight: Number(e.target.value)||0 } }))} />
                              <input className="rounded bg-background border border-border px-2 py-1 text-sm" placeholder="Meu Descanso (s)" type="number" value={inp.rest ?? ''} onChange={(e)=> setPlanInputs(prev=> ({ ...prev, [key]: { ...prev[key], rest: Number(e.target.value)||0 } }))} />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Button size="sm" className="bg-spotify-green" onClick={()=> savePlanSettings(plan.id, id)}>
                                <Save className="h-4 w-4 mr-1" /> Salvar
                              </Button>
                              <Button size="sm" variant="secondary" className="bg-spotify-surface" onClick={()=> setRestVisible(prev => ({ ...prev, [key]: !prev[key] }))}>
                                <TimerIcon className="h-4 w-4 mr-1" /> Cronômetro
                              </Button>
                            </div>
                            {restVisible[key] && (
                              <div className="pt-2">
                                <CountdownTimer label="Descanso" defaultSeconds={planInputs[key]?.rest || 60} minSeconds={15} maxSeconds={300} step={5} onFinish={()=> {
                                  try {
                                    const audio = new Audio('/alarm.mp3');
                                    audio.play().catch(()=>{});
                                  } catch {}
                                }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
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
                      Criado em: {plan.createdAt instanceof Date ? plan.createdAt.toLocaleDateString('pt-BR') : new Date(plan.createdAt).toLocaleDateString('pt-BR')}
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

      <VideoModal isOpen={videoState.open} onClose={()=> setVideoState({ open: false, name: '', url: '' })} exerciseName={videoState.name} videoUrl={videoState.url} />
      <BottomNavigation />
    </div>
  );
};

export default Profile;