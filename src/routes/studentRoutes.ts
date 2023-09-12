import express from "express";
import {
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/controllers/studentController";

import {
  listSubjects,
  enrollSubject,
  unrollSubject,
} from "@/controllers/studentsControllers/studentsFunctionalities";

import { authentication, authorizeRoles } from "@/middlewares/authentication";

const router = express.Router();

router.post("/students", createStudent);

router.put(
  "/students",
  authentication,
  authorizeRoles("student"),
  updateStudent,
);

router.delete(
  "/students",
  authentication,
  authorizeRoles("student"),
  deleteStudent,
);

// studentsFunctionalities

router.get(
  "/students/listSubjects",
  authentication,
  authorizeRoles("student"),
  listSubjects,
);

router.post(
  "/students/enrollSubject/:studentId/:classRoomId",
  authentication,
  authorizeRoles("student"),
  enrollSubject,
);

router.post(
  "/students/unrollSubject/:studentId/:classRoomId",
  authentication,
  authorizeRoles("student"),
  unrollSubject,
);

export { router };
