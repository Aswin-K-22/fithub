// frontend/src/adapters/api/userApi.ts
import { User } from "../../entities/User";
import { UserWithoutSensitiveData } from "../../entities/backendUser";
import { getUsers as apiGetUsers } from "../../lib/api/authApi";

export interface UserRepository {
  getUsers: () => Promise<User[]>;
}

export const userApiRepository: UserRepository = {
  getUsers: async () => {
    const data = await apiGetUsers();
    return data.map((user: UserWithoutSensitiveData) => ({
      name: user.name || "N/A",
      email: user.email,
      membership: user.membershipId ? "Premium" : "N/A",
      status: user.isVerified ? "Active" : "Suspended",
      lastLogin: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A",
      avatar: user.profilePic || "profile pic",
    }));
  },
};