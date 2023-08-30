import dotenv from "dotenv";
dotenv.config();

export const { JWT_INSTRUCTOR_SECRET } = process.env;

if (!JWT_INSTRUCTOR_SECRET) {
  throw new Error(
    "The (secret) key JWT_INSTRUCTOR_SECRET not specified in the .env file",
  );
}

export const { JWT_STUDENTS_SECRET } = process.env;

if (!JWT_STUDENTS_SECRET) {
  throw new Error(
    "The (secret) key JWT_STUDENTS_SECRET not specified in the .env file",
  );
}
