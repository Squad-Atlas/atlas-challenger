import jwt from "jsonwebtoken";
import { config } from "@/config/config";

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
