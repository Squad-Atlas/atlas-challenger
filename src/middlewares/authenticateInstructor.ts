import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { header } from "@/utils/createInstructorToken";
import { config } from "@/config/config";

import { UnauthorizedError } from "@/helpers/api-errors";
import "express-async-errors";

const JWT_INSTRUCTOR_SECRET = config.jwt.secret;

export const authenticateInstructor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const instructorToken = header.get("token") || "";
  if (!instructorToken || !instructorToken.startsWith("BearerInstructor ")) {
    throw new UnauthorizedError("Invalid token");
  }
  const token = instructorToken.split(" ")[1];
  const tokenDecoded = jwt.verify(token, JWT_INSTRUCTOR_SECRET!);
  console.log(tokenDecoded);
  next();
};
