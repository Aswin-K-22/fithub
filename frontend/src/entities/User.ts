// frontend/src/entities/User.ts
export interface User {
  id: string; // Add this if missing
  name: string;
  email: string;
  membership?: string;
  status?: string;
  lastLogin?: string;
  profilePic?: string;
  isVerified?: boolean; // Add this if missing
}

export interface UserProfileData {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  fitnessProfile: {
    goals?: string[];
    weight?: number;
    height?: number;
    level?: string;
    calorieGoal?: number;
    updatedAt?: string;
  };
  progress: {
    workoutDate: string;
    planId: string;
    exercisesCompleted: {
      exerciseId: string;
      name: string;
      sets?: number;
      reps?: number;
      weight?: number;
      duration?: number;
      difficulty?: string;
      caloriesBurned?: number;
    }[];
    totalDuration?: number;
    totalCaloriesBurned?: number;
    dailyDifficulty?: string;
  }[];
  weeklySummary: {
    weekStart: string;
    weekEnd: string;
    totalCaloriesBurned?: number;
    weeklyDifficulty?: string;
  }[];
  profilePic?: string;
  workoutPlanId?: string;
}

export default User;