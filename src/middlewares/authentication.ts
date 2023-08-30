import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/helpers/api-errors";
import "express-async-errors";
import { isTokenValid } from "@/utils/jwt";

export interface Payload extends Request {
  user: {
    _id: string;
    user: string;
    role: string;
  };
}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid token");
  }
  const token: string = authHeader.split(" ")[1];

  const decoded = isTokenValid(token) as jwt.JwtPayload;
  const { _id, user, role } = decoded;
  (req as Payload).user = { _id, user, role };

  next();
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes((req as Payload).user.role)) {
      throw new UnauthorizedError(
        "You are not authorized to acesss this action",
      );
    }
    next();
  };
};
