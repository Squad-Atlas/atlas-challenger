import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || "";
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

if (!JWT_SECRET) {
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
    secret: JWT_SECRET,
  },
  sendMail: {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    username: SMTP_USERNAME,
    password: SMTP_PASSWORD,
  },
};
