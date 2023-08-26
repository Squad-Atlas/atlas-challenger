import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { header } from "@/utils/createInstructorToken";
import { JWT_INSTRUCTOR_SECRET } from "@/config/jwt";

export const authenticateInstructor = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instructorToken = header.get("token") || "";
    if (!instructorToken || !instructorToken.startsWith("BearerInstructor ")) {
      res.status(401).json({ error: "Invalid token" });
      next();
    }
    const token = instructorToken.split(" ")[1];
    const tokenDecoded = jwt.verify(token, JWT_INSTRUCTOR_SECRET!);
    console.log(tokenDecoded);
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to authorize token" });
  }
};
