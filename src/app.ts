import express from "express";
import { router as studentRoutes } from "@/routes/studentRoutes";
import { router as instructorRoutes } from "@/routes/instructorRoutes";
import { router as authRoutes } from "@/routes/authRoutes";
import { router as adminRoutes } from "@/routes/adminRoutes";

import { config } from "@/config/config";

import cookieParser from "cookie-parser";

import { errorMiddleware } from "@/middlewares/error";
import "express-async-errors";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(cookieParser(config.jwt.secret));
app.use(
  fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 4,
    useTempFiles: true,
    tempFileDir: "../temp",
  }),
);

app.use("/api/v1", studentRoutes);
app.use("/api/v1", instructorRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", adminRoutes);

app.use(errorMiddleware);

export default app;
