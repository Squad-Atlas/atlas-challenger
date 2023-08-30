import express from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

import { authenticateStudents } from "@/middlewares/authenticateStudents";

const router = express.Router();

router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.get("/students", authenticateStudents, getStudents);
router.delete("/students/:id", deleteStudent);

export { router };
