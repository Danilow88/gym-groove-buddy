import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Trash2, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkout } from "@/hooks/use-workout";

interface WeeklyPlan {
  [key: string]: {
    exercises: string[];
    notes: string;
    is_rest_day: boolean;
  };
}

const daysOfWeek = [
  { key: 'monday', name: 'Segunda-feira' },
  { key: 'tuesday', name: 'Terça-feira' },
  { key: 'wednesday', name: 'Quarta-feira' },
  { key: 'thursday', name: 'Quinta-feira' },
  { key: 'friday', name: 'Sexta-feira' },
  { key: 'saturday', name: 'Sábado' },
  { key: 'sunday', name: 'Domingo' }
];

type ExerciseLite = { id: string; name: string; muscle: string };

interface WeeklyAdminModalProps {
  userId: string;
  userName: string;
  onSuccess?: () => void;
}

export function WeeklyAdminModal({ userId, userName, onSuccess }: WeeklyAdminModalProps) {
  const { user } = useAuth();
  const { exercises } = useWorkout();
  const [open, setOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [observations, setObservations] = useState('');
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    // Initialize empty plan
    const initialPlan: WeeklyPlan = {};
    daysOfWeek.forEach(day => {
      initialPlan[day.key] = {
        exercises: [],
        notes: '',
        is_rest_day: false
      };
    });
    setWeeklyPlan(initialPlan);
  }, []);

  const exercisesByGroup = (exercises as ExerciseLite[]).reduce((acc, exercise) => {
    const group = exercise.muscle || 'Outros';
    if (!acc[group]) acc[group] = [] as ExerciseLite[];
    (acc[group] as ExerciseLite[]).push(exercise);
    return acc;
  }, {} as { [key: string]: ExerciseLite[] });

  const handleDayToggleRestDay = (dayKey: string, isRestDay: boolean) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        is_rest_day: isRestDay,
        exercises: isRestDay ? [] : prev[dayKey].exercises
      }
    }));
  };

  const handleAddExercise = (dayKey: string, exerciseId: string) => {
    const exercise = mockExercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    setWeeklyPlan(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        exercises: [...prev[dayKey].exercises, exercise.name]
      }
    }));
  };

  const handleRemoveExercise = (dayKey: string, exerciseIndex: number) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        exercises: prev[dayKey].exercises.filter((_, index) => index !== exerciseIndex)
      }
    }));
  };

  const handleNotesChange = (dayKey: string, notes: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        notes
      }
    }));
  };

  const handleSubmit = async () => {
    if (!planName.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_weekly_workout_plan', {
        target_user_id: userId,
        plan_name: planName,
        plan_observations: observations || null,
        weekly_schedule: weeklyPlan
      });

      if (error) {
        console.error('Erro ao criar plano semanal:', error);
        alert('Erro ao criar plano semanal');
      } else {
        alert('Plano semanal criado com sucesso!');
        setOpen(false);
        setPlanName('');
        setObservations('');
        setSelectedDay(null);
        onSuccess?.();
        
        // Reset weekly plan
        const initialPlan: WeeklyPlan = {};
        daysOfWeek.forEach(day => {
          initialPlan[day.key] = {
            exercises: [],
            notes: '',
            is_rest_day: false
          };
        });
        setWeeklyPlan(initialPlan);
      }
    } catch (error) {
      console.error('Erro ao criar plano semanal:', error);
      alert('Erro ao criar plano semanal');
    } finally {
      setLoading(false);
    }
  };

  const getTotalExercises = () => {
    return Object.values(weeklyPlan).reduce((total, day) => total + day.exercises.length, 0);
  };

  const getRestDaysCount = () => {
    return Object.values(weeklyPlan).filter(day => day.is_rest_day).length;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Criar Plano Semanal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Criar Plano Semanal - {userName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planName">Nome do Plano</Label>
              <Input
                id="planName"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="Ex: Plano Iniciante Semanal"
              />
            </div>
            <div className="space-y-2">
              <Label>Resumo</Label>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {getTotalExercises()} exercícios
                </Badge>
                <Badge variant="outline">
                  {getRestDaysCount()} dias descanso
                </Badge>
                <Badge variant="outline">
                  {7 - getRestDaysCount()} dias treino
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações Gerais</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações sobre o plano semanal..."
              rows={2}
            />
          </div>

          {/* Configuração por Dia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurar Dias da Semana</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {daysOfWeek.map((day) => {
                const dayPlan = weeklyPlan[day.key];
                if (!dayPlan) return null;

                return (
                  <Card key={day.key} className="relative">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {day.name}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`rest-${day.key}`}
                            checked={dayPlan.is_rest_day}
                            onCheckedChange={(checked) => 
                              handleDayToggleRestDay(day.key, !!checked)
                            }
                          />
                          <Label htmlFor={`rest-${day.key}`} className="text-xs">
                            <Coffee className="h-3 w-3 inline mr-1" />
                            Descanso
                          </Label>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {dayPlan.is_rest_day ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <Coffee className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Dia de descanso</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Exercícios */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">Exercícios</Label>
                              <Badge variant="secondary" className="text-xs">
                                {dayPlan.exercises.length}
                              </Badge>
                            </div>
                            
                            {dayPlan.exercises.map((exercise, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                                <span className="truncate">{exercise}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveExercise(day.key, index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}

                            {/* Adicionar Exercício */}
                            <Select onValueChange={(exerciseId) => handleAddExercise(day.key, exerciseId)}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="+ Adicionar exercício" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(exercisesByGroup).map(([group, exercises]) => (
                                  <div key={group}>
                                    <div className="font-medium text-xs px-2 py-1 text-muted-foreground">
                                      {group}
                                    </div>
                                    {exercises.map((exercise) => (
                                      <SelectItem key={exercise.id} value={exercise.id} className="text-xs pl-4">
                                        {exercise.name}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Notas */}
                          <div className="space-y-1">
                            <Label className="text-xs font-medium">Observações</Label>
                            <Textarea
                              value={dayPlan.notes}
                              onChange={(e) => handleNotesChange(day.key, e.target.value)}
                              placeholder="Notas para este dia..."
                              className="text-xs"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!planName.trim() || loading}
              className="bg-spotify-green hover:bg-spotify-green/90"
            >
              {loading ? 'Criando...' : 'Criar Plano Semanal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
