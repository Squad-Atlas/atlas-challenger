import jwt from "jsonwebtoken";
import { Instructor } from "@/models/instructor";
import { JWT_INSTRUCTOR_SECRET } from "@/config/jwt";
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
