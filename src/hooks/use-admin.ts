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
          exercises: row.exercises ?? [],
          observations: row.observations ?? '',
          createdBy: row.created_by,
          createdAt: new Date(row.created_at),
          planType: row.plan_type,
          periodStartDate: row.period_start_date,
          periodEndDate: row.period_end_date,
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
    userId: string,
    name: string,
    exercises: string[],
    observations: string,
    exerciseSettings?: Record<string, { sets: number; rest: number; weight: number }>,
    options?: { planType?: 'daily' | 'weekly' | 'monthly' | 'custom'; periodStartDate?: string; periodEndDate?: string }
  ) => {
    try {
      if (isAdmin && user) {
        const { data, error } = await supabase.from('workout_plans').insert([{
          user_id: userId,
          name,
          exercises,
          observations,
          created_by: user.id,
          plan_type: options?.planType || 'daily',
          period_start_date: options?.periodStartDate || null,
          period_end_date: options?.periodEndDate || null
        }]).select().single();

        if (!error && data) {
          const newPlan: WorkoutPlan = {
            id: data.id,
            userId: data.user_id,
            name: data.name,
            exercises: data.exercises,
            observations: data.observations || '',
            createdBy: user.email || 'Admin',
            createdAt: new Date(data.created_at),
            exerciseSettings: exerciseSettings || {},
            planType: data.plan_type,
            periodStartDate: data.period_start_date,
            periodEndDate: data.period_end_date
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
    getWorkoutPlansForUser,
    deleteWorkoutPlan,
    loadWorkoutPlans
  };
}
