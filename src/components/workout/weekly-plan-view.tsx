import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Dumbbell, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface WeeklyWorkoutDetail {
  plan_id: string;
  plan_name: string;
  plan_observations: string | null;
  day_of_week: string;
  day_name: string;
  exercises: string[];
  notes: string | null;
  is_rest_day: boolean;
}

interface TodayWorkout {
  plan_name: string;
  exercises: string[];
  notes: string | null;
  is_rest_day: boolean;
}

const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const dayIcons: { [key: string]: React.ReactNode } = {
  monday: <Calendar className="h-4 w-4" />,
  tuesday: <Calendar className="h-4 w-4" />,
  wednesday: <Calendar className="h-4 w-4" />,
  thursday: <Calendar className="h-4 w-4" />,
  friday: <Calendar className="h-4 w-4" />,
  saturday: <Calendar className="h-4 w-4" />,
  sunday: <Coffee className="h-4 w-4" />
};

export function WeeklyPlanView() {
  const { user } = useAuth();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyWorkoutDetail[]>([]);
  const [todayWorkout, setTodayWorkout] = useState<TodayWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWeeklyPlan();
      loadTodayWorkout();
    }
  }, [user]);

  const loadWeeklyPlan = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_weekly_plan', {
        user_id: user.id
      });

      if (error) {
        console.error('Erro ao carregar plano semanal:', error);
      } else {
        const processedData = (data || []).map((item: any) => ({
          ...item,
          exercises: Array.isArray(item.exercises) ? item.exercises : 
                     typeof item.exercises === 'string' ? JSON.parse(item.exercises) : []
        }));
        setWeeklyPlan(processedData);
      }
    } catch (error) {
      console.error('Erro ao carregar plano semanal:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayWorkout = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_today_workout', {
        user_id: user.id
      });

      if (error) {
        console.error('Erro ao carregar treino de hoje:', error);
      } else {
        const todayData = data?.[0];
        if (todayData) {
          setTodayWorkout({
            ...todayData,
            exercises: Array.isArray(todayData.exercises) ? todayData.exercises : 
                      typeof todayData.exercises === 'string' ? JSON.parse(todayData.exercises) : []
          });
        } else {
          setTodayWorkout(null);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar treino de hoje:', error);
    }
  };

  const getCurrentDayOfWeek = () => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return daysMap[dayIndex];
  };

  const getTodayName = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const daysMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return daysMap[dayIndex];
  };

  const groupedByPlan = weeklyPlan.reduce((acc, item) => {
    if (!acc[item.plan_name]) {
      acc[item.plan_name] = {
        plan_id: item.plan_id,
        plan_name: item.plan_name,
        plan_observations: item.plan_observations,
        days: {}
      };
    }
    if (item.day_of_week) {
      acc[item.plan_name].days[item.day_of_week] = {
        day_name: item.day_name,
        exercises: item.exercises,
        notes: item.notes,
        is_rest_day: item.is_rest_day
      };
    }
    return acc;
  }, {} as any);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Treino de Hoje */}
      {todayWorkout && (
        <Card className="border-spotify-green bg-spotify-surface/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-spotify-green">
              <Clock className="h-5 w-5" />
              Treino de Hoje - {getTodayName()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayWorkout.is_rest_day ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Coffee className="h-4 w-4" />
                <span>Dia de descanso 😴</span>
              </div>
            ) : (
              <div className="space-y-3">
                {todayWorkout.exercises?.map((exercise: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                    <span className="font-medium">{exercise}</span>
                    <Badge variant="outline" className="text-xs">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      3 séries
                    </Badge>
                  </div>
                ))}
                {todayWorkout.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    📝 {todayWorkout.notes}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Planos Semanais */}
      {Object.keys(groupedByPlan).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhum Plano Semanal</h3>
            <p>Solicite à Yara para criar um plano de treino semanal para você!</p>
          </CardContent>
        </Card>
      ) : (
        Object.values(groupedByPlan).map((plan: any) => (
          <Card key={plan.plan_id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-spotify-green" />
                {plan.plan_name}
              </CardTitle>
              {plan.plan_observations && (
                <p className="text-sm text-muted-foreground">
                  {plan.plan_observations}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {daysOrder.map((dayKey) => {
                  const dayData = plan.days[dayKey];
                  const isToday = dayKey === getCurrentDayOfWeek();
                  
                  if (!dayData) {
                    return (
                      <div key={dayKey} className="p-3 border rounded-lg opacity-50">
                        <div className="flex items-center gap-2 mb-2">
                          {dayIcons[dayKey]}
                          <span className="font-medium text-sm capitalize">
                            {dayKey === 'monday' ? 'Segunda' :
                             dayKey === 'tuesday' ? 'Terça' :
                             dayKey === 'wednesday' ? 'Quarta' :
                             dayKey === 'thursday' ? 'Quinta' :
                             dayKey === 'friday' ? 'Sexta' :
                             dayKey === 'saturday' ? 'Sábado' : 'Domingo'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Sem treino</p>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={dayKey} 
                      className={`p-3 border rounded-lg transition-all ${
                        isToday 
                          ? 'border-spotify-green bg-spotify-green/10 ring-1 ring-spotify-green/20' 
                          : 'border-border hover:border-border/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {dayIcons[dayKey]}
                        <span className={`font-medium text-sm ${isToday ? 'text-spotify-green' : ''}`}>
                          {dayData.day_name}
                        </span>
                        {isToday && <Badge variant="outline" className="text-xs">Hoje</Badge>}
                      </div>
                      
                      {dayData.is_rest_day ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Coffee className="h-3 w-3" />
                          Descanso
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {dayData.exercises?.slice(0, 2).map((exercise: string, index: number) => (
                            <p key={index} className="text-xs font-medium truncate">
                              {exercise}
                            </p>
                          ))}
                          {dayData.exercises?.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{dayData.exercises.length - 2} mais...
                            </p>
                          )}
                        </div>
                      )}
                      
                      {dayData.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          📝 {dayData.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
