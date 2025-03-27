import * as jwt from "jsonwebtoken";

interface JwtPayload {
  email: string;
  id: string;
}

type WithJwtPayload<T> = T & JwtPayload;

export const generateAccessToken = <T>(user: WithJwtPayload<T>): string => {
  return jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_ACCESS_SECRET || "access_secret",
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = <T>(user: WithJwtPayload<T>): string => {
  return jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    { expiresIn: "7d" }
  );
};