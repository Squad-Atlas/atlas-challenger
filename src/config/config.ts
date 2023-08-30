import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "";
const PORT = process.env.PORT || 3000;
const JWT_INSTRUCTOR_SECRET = process.env.JWT_INSTRUCTOR_SECRET;

if (!JWT_INSTRUCTOR_SECRET) {
  throw new Error(
    "The (secret) key JWT_INSTRUCTOR_SECRET not specified in the .env file",
  );
}

if (!MONGO_URL) {
  throw new Error("DB_URL not specified in the .env file");
}

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: PORT,
  },
  jwt: {
    secret: JWT_INSTRUCTOR_SECRET,
  },
};
