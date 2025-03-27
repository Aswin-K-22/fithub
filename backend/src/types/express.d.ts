// // src/types/express.d.ts
// declare module "express" {
//     interface Request {
//       trainer?: {
//         id: string;
//         email: string;
//         // Add other trainer-specific fields if needed
//       };
//       user?: {
//         id: string;
//         email: string;
//         // Add other user-specific fields if needed
//       };
//       admin?: {
//         id: string;
//         email: string;
//         // Add other admin-specific fields if needed
//       };
//     }
//   }

import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
        trainer?: {
        id: string;
        email: string;
      };
      user?: {
        id: string;
        email: string;
      };
      admin?: {
        id: string;
        email: string;
      };
  }
}
