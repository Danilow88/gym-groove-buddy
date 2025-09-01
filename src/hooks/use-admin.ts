import { useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useAdminAuth } from './use-admin-auth';

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  exercises: string[];
  observations: string;
  createdBy: string;
  createdAt: Date;
}

export function useAdmin() {
  const { user } = useAuth();
  const { isAdminAuthenticated } = useAdminAuth();
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  
  const isAdmin = isAdminAuthenticated;
  
  const createWorkoutPlan = useCallback((
    userId: string,
    name: string,
    exercises: string[],
    observations: string
  ) => {
    if (!isAdmin || !user) return false;
    
    const newPlan: WorkoutPlan = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name,
      exercises,
      observations,
      createdBy: user.email || 'Admin',
      createdAt: new Date()
    };
    
    setWorkoutPlans(prev => [newPlan, ...prev]);
    return true;
  }, [isAdmin, user]);
  
  const getWorkoutPlansForUser = useCallback((userId: string) => {
    return workoutPlans.filter(plan => plan.userId === userId);
  }, [workoutPlans]);
  
  const deleteWorkoutPlan = useCallback((planId: string) => {
    if (!isAdmin) return false;
    setWorkoutPlans(prev => prev.filter(plan => plan.id !== planId));
    return true;
  }, [isAdmin]);
  
  return {
    isAdmin,
    workoutPlans,
    createWorkoutPlan,
    getWorkoutPlansForUser,
    deleteWorkoutPlan
  };
}
