import express from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/controllers/studentController";
import { authentication, authorizeRoles } from "@/middlewares/authentication";
const router = express.Router();

router.post("/students", createStudent);
router.put(
  "/students/:id",
  authentication,
  authorizeRoles("student"),
  updateStudent,
);
router.get(
  "/students",
  authentication,
  authorizeRoles("student", "instructor"),
  getStudents,
);
router.delete(
  "/students/:id",
  authentication,
  authorizeRoles("student"),
  deleteStudent,
);

export { router };
