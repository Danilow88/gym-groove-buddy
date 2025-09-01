import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useAdmin } from "@/hooks/use-admin";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useWorkout } from "@/hooks/use-workout";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, CheckCircle, X, Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdminUser, isAdminAuthenticated, authenticateAdmin, logoutAdmin } = useAdminAuth();
  const { isAdmin, workoutPlans, loading, createWorkoutPlan, deleteWorkoutPlan } = useAdmin();
  const { exercises, getMuscleGroups } = useWorkout();
  const { toast } = useToast();

  const [selectedUserId, setSelectedUserId] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [observations, setObservations] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Todos');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = () => {
    const success = authenticateAdmin(adminPassword);
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vinda ao painel administrativo, Yara!",
      });
      setAdminPassword('');
    } else {
      toast({
        title: "Senha incorreta",
        description: "Verifique sua senha e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo.",
    });
  };

  // Redirect if not admin user
  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-4">
            Você não tem permissão para acessar esta área.
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  // Show login form if admin user but not authenticated
  if (isAdminUser && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Card className="p-6 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-spotify-green" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Administrativo</h1>
            <p className="text-muted-foreground">
              Olá, Yara! Digite sua senha para acessar o painel.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Senha de Administrador
              </label>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="bg-spotify-surface border-border"
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            
            <Button
              onClick={handleAdminLogin}
              className="w-full bg-spotify-green hover:bg-spotify-green-hover"
              disabled={!adminPassword.trim()}
            >
              <Settings className="h-4 w-4 mr-2" />
              Entrar no Painel
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full border-border hover:bg-spotify-surface"
            >
              Voltar ao Início
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleCreatePlan = async () => {
    if (!workoutName.trim() || selectedExercises.length === 0 || !selectedUserId.trim()) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await createWorkoutPlan(
        selectedUserId,
        workoutName,
        selectedExercises,
        observations
      );

      if (success) {
        toast({
          title: "Treino criado!",
          description: `Treino "${workoutName}" criado com sucesso.`,
        });
        
        // Reset form
        setSelectedUserId('');
        setWorkoutName('');
        setSelectedExercises([]);
        setObservations('');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o treino.",
        variant: "destructive"
      });
    }
  };

  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises(prev => {
      const exists = prev.includes(exerciseId);
      if (exists) return prev.filter(id => id !== exerciseId);
      return [...prev, exerciseId];
    });
  };

  const getFilteredExercises = () => {
    if (selectedMuscleGroup === 'Todos') return exercises;
    return exercises.filter(exercise => exercise.muscle === selectedMuscleGroup);
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise?.name || 'Exercício desconhecido';
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const success = await deleteWorkoutPlan(planId);
      if (success) {
        toast({
          title: "Treino excluído!",
          description: "Plano de treino removido com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o treino.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-spotify-green/20 rounded-full flex items-center justify-center">
            <Settings className="h-4 w-4 text-spotify-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Administração</h1>
            <p className="text-sm text-muted-foreground">
                          Bem-vinda, Yara! Gerencie treinos dos usuários
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="ml-auto border-border hover:bg-spotify-surface"
          >
            <X className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Create Workout Plan */}
        <Card className="p-4">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-spotify-green" />
            Criar Plano de Treino
          </h2>

          <div className="space-y-4">
            {/* User ID Input */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                ID/Email do Usuário *
              </label>
              <Input
                placeholder="Digite o ID ou email do usuário"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="bg-spotify-surface border-border"
              />
            </div>

            {/* Workout Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nome do Treino *
              </label>
              <Input
                placeholder="Ex: Treino Full Body - Iniciante"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="bg-spotify-surface border-border"
              />
            </div>

            {/* Muscle Group Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Filtrar por Grupo Muscular
              </label>
              <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                <SelectTrigger className="bg-spotify-surface border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-spotify-card border-border">
                  {getMuscleGroups().map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exercise Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Exercícios Selecionados ({selectedExercises.length}) *
              </label>
              <div className="max-h-60 overflow-y-auto bg-spotify-surface border border-border rounded-lg p-3 space-y-2">
                {getFilteredExercises().map((exercise) => {
                  const isSelected = selectedExercises.includes(exercise.id);
                  return (
                    <div
                      key={exercise.id}
                      className={`p-2 rounded cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-spotify-green bg-spotify-green/10'
                          : 'border-border hover:border-spotify-green/50 hover:bg-spotify-green/5'
                      }`}
                      onClick={() => toggleExercise(exercise.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'border-spotify-green bg-spotify-green' : 'border-border'
                            }`}>
                              {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <span className="font-medium text-sm text-foreground">
                              {exercise.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground ml-6">
                            {exercise.muscle} • {exercise.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Observações do Treino
              </label>
              <Textarea
                placeholder="Ex: Foque na forma correta, descanse 60s entre séries, aumente progressivamente a carga..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="bg-spotify-surface border-border min-h-20"
              />
            </div>

            <Button
              onClick={handleCreatePlan}
              className="w-full bg-spotify-green hover:bg-spotify-green-hover"
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {loading ? 'Criando...' : 'Criar Plano de Treino'}
            </Button>
          </div>
        </Card>

        {/* Existing Plans */}
        <Card className="p-4">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Planos de Treino Criados ({workoutPlans.length})
          </h2>

          {workoutPlans.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum plano de treino criado ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {workoutPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-spotify-surface rounded-lg p-4 border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Usuário: {plan.userId} • {plan.exercises.length} exercícios
                      </p>
                      <div className="text-xs text-muted-foreground mb-2">
                        Exercícios: {plan.exercises.map(id => getExerciseName(id)).join(', ')}
                      </div>
                      {plan.observations && (
                        <p className="text-sm text-foreground bg-background p-2 rounded border border-border">
                          <strong>Observações:</strong> {plan.observations}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Criado em: {plan.createdAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Admin;
