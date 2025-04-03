// frontend/src/adapters/api/admin/userApi.ts
import { getUsers, toggleUserVerification } from "../../../lib/api/authApi";

export const userApiRepository = {
  getUsers: (page: number, limit: number) => getUsers(page, limit),
  toggleUserVerification: (id: string) => toggleUserVerification(id),
};