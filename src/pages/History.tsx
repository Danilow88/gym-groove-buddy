import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Card } from "@/components/ui/card";
import { useWorkout } from "@/hooks/use-workout";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Dumbbell } from "lucide-react";

const History = () => {
  const { workoutHistory, exercises } = useWorkout();

  const getExerciseName = (exerciseId: string) => {
    return exercises.find(e => e.id === exerciseId)?.name || 'Exercício desconhecido';
  };

  const groupSetsByExercise = (sets: any[]) => {
    const grouped = sets.reduce((acc, set) => {
      if (!acc[set.exerciseId]) {
        acc[set.exerciseId] = [];
      }
      acc[set.exerciseId].push(set);
      return acc;
    }, {});
    return grouped;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-spotify-green" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
            <p className="text-sm text-muted-foreground">
              {workoutHistory.length} treinos realizados
            </p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 space-y-4">
        {workoutHistory.length === 0 ? (
          <Card className="bg-gradient-card border-border p-8 text-center">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum treino ainda
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece seu primeiro treino para ver o histórico aqui
            </p>
          </Card>
        ) : (
          workoutHistory.map((session) => {
            const groupedSets = groupSetsByExercise(session.sets);
            
            return (
              <Card key={session.id} className="bg-gradient-card border-border hover:shadow-card transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {format(session.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(session.date, "HH:mm")} • {session.sets.length} séries
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-spotify-green font-medium">
                        {Object.keys(groupedSets).length} exercícios
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(groupedSets).map(([exerciseId, sets]: [string, any[]]) => (
                      <div key={exerciseId} className="bg-spotify-surface rounded-lg p-3">
                        <h4 className="font-medium text-foreground mb-2">
                          {getExerciseName(exerciseId)}
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {sets.map((set, index) => (
                            <div key={set.id} className="text-center">
                              <div className="text-xs text-muted-foreground">
                                Série {index + 1}
                              </div>
                              <div className="text-sm font-medium">
                                {set.weight}kg × {set.reps}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default History;