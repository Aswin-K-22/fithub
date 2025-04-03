/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/useCases/admin/toggleUserVerification.ts
import { User } from "../../entities/User";

export const toggleUserVerification = async (
  userApiRepository: { toggleUserVerification: (id: string) => Promise<any> },
  id: string
): Promise<User> => {
  const response = await userApiRepository.toggleUserVerification(id);
  return response.user;
};