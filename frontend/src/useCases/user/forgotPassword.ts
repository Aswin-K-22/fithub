/* eslint-disable @typescript-eslint/no-explicit-any */
// src/useCases/user/forgotPassword.ts
export const forgotPasswordUseCase = async (
    userApiRepository: { forgotPassword: (email: string) => Promise<any> },
    email: string
  ) => {
    return userApiRepository.forgotPassword(email);
  };