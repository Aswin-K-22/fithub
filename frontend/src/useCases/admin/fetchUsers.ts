/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/useCases/admin/fetchUsers.ts

import User from "../../entities/User";

export const fetchUsers = async (
  userApiRepository: { getUsers: (page: number, limit: number) => Promise<any> },
  page: number = 1,
  limit: number = 3
): Promise<User[]> => {
  const response = await userApiRepository.getUsers(page, limit);
  return response.users;
};