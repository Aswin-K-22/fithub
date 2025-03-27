// # Business logic

import { User } from "../entities/User";
import { UserRepository } from "../adapters/api/userApi"

export const fetchUsers = async (repository: UserRepository): Promise<User[]> => {
  return repository.getUsers();
};