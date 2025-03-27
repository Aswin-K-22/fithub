// frontend/src/entities/backendUser.ts
export type UserWithoutSensitiveData = {
    id: string;
    email: string;
    role: string;
    name: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    isVerified: boolean | null;
    membershipId: string | null;
    fitnessProfile: {
      goals: string[];
      weight: number | null;
      height: number | null;
      level: string | null;
      calorieGoal: number | null;
      updatedAt: Date | null;
    } | null;
    workoutPlanId: string | null;
    progress: {
      workoutDate: Date | null;
      planId: string | null;
      exercisesCompleted: {
        exerciseId: string | null;
        name: string | null;
        sets: number | null;
        reps: number | null;
        weight: number | null;
        duration: number | null;
        difficulty: string | null;
        caloriesBurned: number | null;
      }[];
      totalDuration: number | null;
      totalCaloriesBurned: number | null;
      dailyDifficulty: string | null;
    }[] | null;
    weeklySummary: {
      weekStart: Date | null;
      weekEnd: Date | null;
      totalCaloriesBurned: number | null;
      weeklyDifficulty: string | null;
    }[] | null;
    profilePic: string | null;

  };