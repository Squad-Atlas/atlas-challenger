import express from "express";

import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes";
import "./config/database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
