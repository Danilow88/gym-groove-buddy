import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';
import { useAdminAuth } from './use-admin-auth';
import { supabase } from '@/integrations/supabase/client';

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  exercises: string[];
  observations: string;
  createdBy: string;
  createdAt: Date;
  exerciseSettings?: Record<string, { sets: number; rest: number; weight: number }>;
  planType?: 'daily' | 'weekly' | 'monthly' | 'custom';
  periodStartDate?: string | null;
  periodEndDate?: string | null;
}

export function useAdmin() {
  const { user } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  
  const isAdmin = isAdminAuthenticated;

  // Load workout plans from Supabase profiles (storing in metadata or separate table)
  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  const loadWorkoutPlans = async () => {
    setLoading(true);
    try {
      // Try fetch from Supabase first
      const { data, error } = await supabase.from('workout_plans').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const mapped: WorkoutPlan[] = data.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          name: row.name,
          exercises: Array.isArray(row.exercises) ? row.exercises.map(String) : [],
          observations: row.observations ?? '',
          createdBy: row.created_by,
          createdAt: new Date(row.created_at),
          planType: row.plan_type || 'daily',
          periodStartDate: row.period_start_date || null,
          periodEndDate: row.period_end_date || null,
          exerciseSettings: row.exercise_settings || undefined,
        }));
        setWorkoutPlans(mapped);
        await saveWorkoutPlans(mapped);
      } else {
        // Fallback local
        const stored = localStorage.getItem('admin_workout_plans');
        if (stored) setWorkoutPlans(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading workout plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWorkoutPlans = async (plans: WorkoutPlan[]) => {
    try {
      // Save to localStorage as fallback
      localStorage.setItem('admin_workout_plans', JSON.stringify(plans));
      
      // TODO: When we have database access, save to Supabase here
      // await supabase.from('workout_plans').insert(...)
    } catch (error) {
      console.error('Error saving workout plans:', error);
    }
  };
  
  const createWorkoutPlan = useCallback(async (
    userIdInput: string,
    name: string,
    exercises: string[],
    observations: string,
    exerciseSettings?: Record<string, { sets: number; rest: number; weight: number }>,
    options?: { planType?: 'daily' | 'weekly' | 'monthly' | 'custom'; periodStartDate?: string; periodEndDate?: string }
  ) => {
    try {
      // Resolve user id quando o admin digita email em vez do UUID
      let userId = userIdInput;
      if (userIdInput.includes('@')) {
        try {
          const { data } = await (supabase as any).rpc('search_users', { search_term: userIdInput });
          const match = (data || []).find((u: any) => u.email === userIdInput);
          if (match?.id) userId = match.id;
        } catch (e) {
          console.warn('RPC search_users falhou, usando valor informado como userId');
        }
      }

      if (isAdmin && user) {
        const { data, error } = await supabase.from('workout_plans').insert([{
          user_id: userId,
          name,
          exercises,
          observations,
          created_by: user.id,
          plan_type: options?.planType || 'daily',
          period_start_date: options?.periodStartDate || null,
          period_end_date: options?.periodEndDate || null,
          exercise_settings: exerciseSettings || null
        }]).select().single();

        if (!error && data) {
          const newPlan: WorkoutPlan = {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            exercises: Array.isArray(data.exercises) ? data.exercises.map(String) : [],
            observations: data.observations || '',
            createdBy: user.email || 'Admin',
            createdAt: new Date(data.created_at),
            exerciseSettings: exerciseSettings || {},
            planType: (options?.planType || 'daily') as any,
            periodStartDate: options?.periodStartDate || null,
            periodEndDate: options?.periodEndDate || null
          };
          const updatedPlans = [newPlan, ...workoutPlans];
          setWorkoutPlans(updatedPlans);
          await saveWorkoutPlans(updatedPlans);
          return true;
        }
        console.error('Error saving to Supabase:', error);
      }

      // Fallback local (sem exigir admin autenticado)
      const newPlan: WorkoutPlan = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        name,
        exercises,
        observations,
        createdBy: user?.email || 'Admin',
        createdAt: new Date(),
        exerciseSettings: exerciseSettings || {},
        planType: options?.planType || 'daily',
        periodStartDate: options?.periodStartDate || null,
        periodEndDate: options?.periodEndDate || null
      };
      const updatedPlans = [newPlan, ...workoutPlans];
      setWorkoutPlans(updatedPlans);
      await saveWorkoutPlans(updatedPlans);
      return true;
    } catch (error) {
      console.error('Error creating workout plan:', error);
      return false;
    }
  }, [isAdmin, user, workoutPlans]);
  
  const getWorkoutPlansForUser = useCallback((userId: string) => {
    return workoutPlans.filter(plan => plan.userId === userId);
  }, [workoutPlans]);
  
  const updateWorkoutPlan = useCallback(async (
    planId: string,
    fields: Partial<{
      name: string;
      exercises: string[];
      observations: string;
      planType: 'daily' | 'weekly' | 'monthly' | 'custom';
      periodStartDate: string | null;
      periodEndDate: string | null;
    }>
  ) => {
    try {
      const payload: any = {};
      if (fields.name !== undefined) payload.name = fields.name;
      if (fields.exercises !== undefined) payload.exercises = fields.exercises;
      if (fields.observations !== undefined) payload.observations = fields.observations;
      if (fields.planType !== undefined) payload.plan_type = fields.planType;
      if (fields.periodStartDate !== undefined) payload.period_start_date = fields.periodStartDate;
      if (fields.periodEndDate !== undefined) payload.period_end_date = fields.periodEndDate;

      if (Object.keys(payload).length > 0) {
        const { error } = await supabase.from('workout_plans').update(payload).eq('id', planId);
        if (error) console.error('Supabase update failed, applying local fallback:', error);
      }

      const updated = workoutPlans.map(p => p.id === planId ? {
        ...p,
        name: fields.name ?? p.name,
        exercises: fields.exercises ?? p.exercises,
        observations: fields.observations ?? p.observations,
        planType: (fields.planType ?? p.planType) as any,
        periodStartDate: fields.periodStartDate ?? p.periodStartDate ?? null,
        periodEndDate: fields.periodEndDate ?? p.periodEndDate ?? null,
      } : p);
      setWorkoutPlans(updated);
      await saveWorkoutPlans(updated);
      return true;
    } catch (e) {
      console.error('Error updating workout plan:', e);
      return false;
    }
  }, [workoutPlans]);

  const deleteWorkoutPlan = useCallback(async (planId: string) => {
    if (!isAdmin) return false;

    try {
      // Delete from Supabase
      const { error } = await supabase.from('workout_plans').delete().eq('id', planId);
      
      if (error) {
        console.error('Error deleting from Supabase:', error);
      }

      // Update local state regardless
      const updatedPlans = workoutPlans.filter(plan => plan.id !== planId);
      setWorkoutPlans(updatedPlans);
      await saveWorkoutPlans(updatedPlans);

      return true;
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      return false;
    }
  }, [isAdmin, workoutPlans]);
  
  return {
    isAdmin,
    workoutPlans,
    loading,
    createWorkoutPlan,
    updateWorkoutPlan,
    getWorkoutPlansForUser,
    deleteWorkoutPlan,
    loadWorkoutPlans
  };
}
