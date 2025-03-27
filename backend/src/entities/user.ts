import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{}>;

export type UserWithoutSensitiveData = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    role: true;
    name: true;
    createdAt: true;
    updatedAt: true;
    isVerified: true;
    membershipId: true;
    fitnessProfile: true;
    workoutPlanId: true;
    progress: true;
    weeklySummary: true;
    profilePic: true;
  };
}>;

export default User;