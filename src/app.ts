import express from "express";
import { Request, Response } from "express";
import { router as studentRoutes } from "./routes/studentRoutes";
import { router as instructorRoutes } from "./routes/instructorRoutes";

const app = express();


app.use(express.json());
app.use("/api/v1", studentRoutes);
app.use("/api/v1", instructorRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
