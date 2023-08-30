import jwt from "jsonwebtoken";
import { config } from "@/config/config";
import { Response } from "express";

const secret = config.jwt.secret;

interface User {
  _id: string;
  user: string;
  role: string;
}

export const isTokenValid = (token: string) => jwt.verify(token, secret);

export const createJWT = (payload: User) => {
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: "30d",
  });
  return token;
};

export const convertPayload = (userRequest: User) => {
  return {
    _id: userRequest._id,
    user: userRequest.user,
    role: userRequest.role,
  };
};

export const attachCookiesToResponse = ({
  res,
  user,
}: {
  res: Response;
  user: User;
}) => {
  const payload = user;
  const token = createJWT(payload);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    signed: true,
  });
};
