import { BadRequestError } from "@/helpers/api-errors";
import { Request, Response } from "express";

import InstructorModel, { Instructor } from "@/models/instructor";
import StudentModel, { Student } from "@/models/student";
import {
  attachCookiesToResponse,
  convertPayload,
  createJWT,
} from "@/utils/jwt";
import AdminModel, { IAdmin } from "@/models/admin";

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Login in application
 *    description: Login to the application
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              user:
 *                  type: string
 *                  example: "Diego"
 *              password:
 *                  type: string
 *                  example: "Password@123"
 *    responses:
 *      200:
 *        description: A list of instructors
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/AuthResponse"
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Invalid Credentials
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Internal Server Error
 */

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
    throw new BadRequestError("Invalid Credentials");
  }
  const userRequest = convertPayload(userLogin);
  const token = createJWT(userRequest);

  attachCookiesToResponse({ res, user: userRequest });
  res.status(200).json({ user: { name: userLogin.name }, token });
};

/**
 * @swagger
 * /auth/logout:
 *  get:
 *    tags:
 *      - Auth
 *    summary: Logout application
 *    description: Logout application
 *    responses:
 *      200:
 *        description: Logout application
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/AuthResponse"
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Internal Server Error
 */

export const logout = async (req: Request, res: Response) => {
  if (req.signedCookies.token) {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out!" });
  }

  res.status(500).json({ message: "Internal Server Error" });
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (!user || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const userLogin: IAdmin | null = await AdminModel.findOne({ user });

  if (!userLogin) {
    throw new BadRequestError("Invalid Credentials");
  }

  if (userLogin.password !== password)
    throw new BadRequestError("Invalid Credentials");

  const userRequest = convertPayload(userLogin);
  const token = createJWT(userRequest);

  attachCookiesToResponse({ res, user: userRequest });
  res.status(200).json({ user: { user: userLogin.user }, token });
};
