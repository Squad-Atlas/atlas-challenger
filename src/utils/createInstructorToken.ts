import jwt from "jsonwebtoken";
import { Instructor } from "@/models/instructor";
import { config } from "@/config/config";

const JWT_INSTRUCTOR_SECRET = config.jwt.secret;

export const header = new Headers();

export const createInstructorToken = (instructor: Instructor) => {
  const user = {
    name: instructor.name,
    email: instructor.email,
    userType: instructor.user,
  };
  const token = jwt.sign(user, JWT_INSTRUCTOR_SECRET!, {
    algorithm: "HS256",
    expiresIn: 60,
  });
  header.append("token", "BearerInstructor " + token);
  console.log(token);
};
