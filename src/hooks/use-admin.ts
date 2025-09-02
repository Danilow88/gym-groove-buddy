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
  daysOfWeek?: string[]; // Dias da semana selecionados
}

export function useAdmin() {
  const { user } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  
  const isAdmin = isAdminAuthenticated;

  // Load workout plans from Supabase profiles (storing in metadata or separate table)
  useEffect(() => {
    if (isAdmin) {
      loadWorkoutPlans();
    }
  }, [isAdmin]);

  const loadWorkoutPlans = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // For now, we'll use localStorage as a fallback since we can't access the DB directly
      const stored = localStorage.getItem('admin_workout_plans');
      if (stored) {
        const plans = JSON.parse(stored);
        setWorkoutPlans(plans);
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
    daysOfWeek: string[] = []
  ) => {
    if (!isAdmin || !user) return false;
    
        try {
      // Save to Supabase
      const { data, error } = await supabase.from('workout_plans').insert([{
        user_id: userId,
        name,
        exercises,
        observations,
        created_by: user.id,
        days_of_week: daysOfWeek,
        is_weekly_plan: false // Para planos simples com dias específicos
      }]).select().single();

      if (error) {
        console.error('Error saving to Supabase:', error);
        // Fallback to local storage
        const newPlan: WorkoutPlan = {
          id: Math.random().toString(36).substr(2, 9),
          userId,
          name,
          exercises,
          observations,
          createdBy: user.email || 'Admin',
          createdAt: new Date(),
          daysOfWeek
        };
        const updatedPlans = [newPlan, ...workoutPlans];
        setWorkoutPlans(updatedPlans);
        await saveWorkoutPlans(updatedPlans);
        return true;
      }

      // Update local state with Supabase data
      const newPlan: WorkoutPlan = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        exercises: Array.isArray(data.exercises) ? data.exercises.map((ex: any) => String(ex)) : [],
        observations: data.observations || '',
        createdBy: user.email || 'Admin',
        createdAt: new Date(data.created_at),
        daysOfWeek: data.days_of_week || []
      };
      const updatedPlans = [newPlan, ...workoutPlans];
      setWorkoutPlans(updatedPlans);
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
