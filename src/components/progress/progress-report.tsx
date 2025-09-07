import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Activity, Target, Calendar, Award, Zap, Heart, Brain } from "lucide-react";
import { WorkoutSession } from "@/hooks/use-workout";

interface ProgressReportProps {
  workoutHistory: WorkoutSession[];
  profile: {
    weight?: number;
    height?: number;
    birth_date?: string;
  };
}

export const ProgressReport = ({ workoutHistory, profile }: ProgressReportProps) => {
  // Cálculos de métricas
  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((total, session) => total + session.sets.length, 0);
  
  const last30Days = workoutHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return sessionDate >= thirtyDaysAgo;
  });

  const thisWeek = workoutHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo;
  });

  // Análise de frequência
  const avgWorkoutsPerWeek = totalWorkouts > 0 ? (totalWorkouts / Math.max(1, Math.ceil(totalWorkouts / 7))).toFixed(1) : '0';
  const weeklyConsistency = Math.min(100, (thisWeek.length / 4) * 100); // Assumindo meta de 4 treinos/semana
  
  // Análise de exercícios
  const uniqueExercises = new Set(workoutHistory.flatMap(session => session.sets.map(set => set.exerciseId))).size;
  
  // Tendências de peso (últimos 10 treinos)
  const recentSessions = workoutHistory.slice(-10);
  const weightTrends = recentSessions.reduce((trends, session) => {
    session.sets.forEach(set => {
      if (!trends[set.exerciseId]) {
        trends[set.exerciseId] = [];
      }
      trends[set.exerciseId].push(set.weight);
    });
    return trends;
  }, {} as Record<string, number[]>);

  const improvingExercises = Object.entries(weightTrends).filter(([_, weights]) => {
    if (weights.length < 3) return false;
    const recent = weights.slice(-3);
    const earlier = weights.slice(0, -3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    return recentAvg > earlierAvg;
  }).length;

  // Cálculo do IMC
  const calculateBMI = () => {
    if (!profile.weight || !profile.height) return null;
    const heightInM = profile.height / 100;
    return (profile.weight / (heightInM * heightInM)).toFixed(1);
  };

  // Cálculo da idade
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

  const bmi = calculateBMI();
  const age = calculateAge();

  // Insights personalizados
  const generateInsights = () => {
    const insights = [];
    
    if (thisWeek.length >= 4) {
      insights.push({ type: 'success', text: '🔥 Excelente! Você manteve uma frequência alta esta semana' });
    } else if (thisWeek.length >= 2) {
      insights.push({ type: 'good', text: '💪 Boa frequência esta semana, continue assim!' });
    } else {
      insights.push({ type: 'warning', text: '⚠️ Que tal aumentar a frequência de treinos esta semana?' });
    }

    if (improvingExercises > 0) {
      insights.push({ type: 'success', text: `📈 Você está progredindo em ${improvingExercises} exercícios!` });
    }

    if (uniqueExercises >= 15) {
      insights.push({ type: 'success', text: '🎯 Excelente variedade de exercícios!' });
    }

    if (bmi) {
      const bmiValue = parseFloat(bmi);
      if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        insights.push({ type: 'success', text: '✅ Seu IMC está na faixa ideal!' });
      } else if (bmiValue < 18.5) {
        insights.push({ type: 'info', text: '💡 Considere combinar treinos com alimentação para ganho de massa' });
      } else {
        insights.push({ type: 'info', text: '💡 Combine exercícios com dieta equilibrada para melhor resultado' });
      }
    }

    if (age && age < 25) {
      insights.push({ type: 'info', text: '🚀 Aproveite sua idade para focar em exercícios de força!' });
    } else if (age && age > 40) {
      insights.push({ type: 'info', text: '🧘 Considere incluir mais exercícios de mobilidade e recuperação' });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-spotify-green/10 to-spotify-green/5">
          <div className="w-10 h-10 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Activity className="h-5 w-5 text-spotify-green" />
          </div>
          <div className="text-2xl font-bold text-spotify-green">{totalWorkouts}</div>
          <div className="text-sm text-muted-foreground">Total Treinos</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-500">{totalSets}</div>
          <div className="text-sm text-muted-foreground">Total Séries</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-500">{thisWeek.length}</div>
          <div className="text-sm text-muted-foreground">Esta Semana</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5">
          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Award className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-500">{uniqueExercises}</div>
          <div className="text-sm text-muted-foreground">Exercícios Únicos</div>
        </Card>
      </div>

      {/* Progresso e Consistência */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-spotify-green" />
          Análise de Consistência
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Consistência Semanal</span>
              <span>{weeklyConsistency.toFixed(0)}%</span>
            </div>
            <Progress value={weeklyConsistency} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Últimos 30 dias:</span>
              <span className="font-medium">{last30Days.length} treinos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Média semanal:</span>
              <span className="font-medium">{avgWorkoutsPerWeek}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exercícios em progresso:</span>
              <span className="font-medium text-spotify-green">{improvingExercises}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Dados Físicos */}
      {(profile.weight || profile.height || age) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Perfil Físico
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {profile.weight && (
              <div className="text-center p-3 bg-spotify-surface rounded-lg">
                <div className="text-lg font-semibold">{profile.weight} kg</div>
                <div className="text-muted-foreground">Peso</div>
              </div>
            )}
            {profile.height && (
              <div className="text-center p-3 bg-spotify-surface rounded-lg">
                <div className="text-lg font-semibold">{profile.height} cm</div>
                <div className="text-muted-foreground">Altura</div>
              </div>
            )}
            {bmi && (
              <div className="text-center p-3 bg-spotify-surface rounded-lg">
                <div className="text-lg font-semibold">{bmi}</div>
                <div className="text-muted-foreground">IMC</div>
              </div>
            )}
            {age && (
              <div className="text-center p-3 bg-spotify-surface rounded-lg">
                <div className="text-lg font-semibold">{age} anos</div>
                <div className="text-muted-foreground">Idade</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Insights e Recomendações */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Insights Personalizados
        </h3>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-spotify-surface rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                insight.type === 'success' ? 'bg-green-500' :
                insight.type === 'good' ? 'bg-spotify-green' :
                insight.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
              <p className="text-sm text-foreground flex-1">{insight.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Próximos Passos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Próximos Passos
        </h3>
        
        <div className="space-y-2 text-sm">
          {thisWeek.length < 3 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Meta</Badge>
              <span>Tente fazer pelo menos 3 treinos esta semana</span>
            </div>
          )}
          {uniqueExercises < 10 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Variedade</Badge>
              <span>Explore novos exercícios para trabalhar diferentes músculos</span>
            </div>
          )}
          {improvingExercises === 0 && totalWorkouts > 5 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Progressão</Badge>
              <span>Considere aumentar gradualmente pesos ou repetições</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="outline">Hidratação</Badge>
            <span>Lembre-se de beber água antes, durante e após os treinos</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Descanso</Badge>
            <span>Garanta 7-9 horas de sono para uma boa recuperação muscular</span>
          </div>
        </div>
      </Card>
    </div>
  );
};