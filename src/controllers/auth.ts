import { BadRequestError, UnauthorizedError } from "@/helpers/api-errors";
import { Request, Response } from "express";

import InstructorModel, { Instructor } from "@/models/instructor";
import StudentModel, { Student } from "@/models/student";
import { convertPayload, createJWT } from "@/utils/jwt";

export const login = async (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (!user || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  let userLogin: Instructor | Student | null;
  userLogin = await InstructorModel.findOne({ user });
  if (!userLogin) {
    userLogin = await StudentModel.findOne({ user });
  }

  if (!userLogin) {
    throw new BadRequestError("Invalid Credentials");
  }

  const correctPassword = await userLogin.comparePassword(password);

  if (!correctPassword) {
    throw new UnauthorizedError("Invalid Credentials");
  }
  const userRequest = convertPayload(userLogin);
  const token = createJWT(userRequest);
  res.status(200).json({ user: { name: userLogin.name }, token });
};
