// src/entities/workoutPlan.ts
export interface WorkoutPlan {
    id: string;
    title: string;
    createdBy?: string | null; // trainers._id or null (AI)
    assignedTo: string;        // users._id
    goal: string;              // e.g., "weight_loss"
    level: string;             // "beginner", "intermediate", "advanced"
    duration: number;          // Days, e.g., 30
    startDate: Date;
    endDate: Date;
    dailyWorkouts: {
      day: number;             // 1 to 30
      exercises: {
        id: string;
        name: string;
        sets?: number;
        reps?: number;
        weight?: number;       // kg
        duration?: number;     // Minutes
        estimatedCalories?: number; // kcal
      }[];
      totalDuration?: number;      // Minutes
      totalEstimatedCalories?: number; // kcal
    }[];
    status: string;              // e.g., "active", "completed"
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export default WorkoutPlan;