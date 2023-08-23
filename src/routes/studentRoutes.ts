import express from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController";

const router = express.Router();

router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.get("/students", getStudents);
router.delete("/students/:id", deleteStudent);

export { router };
