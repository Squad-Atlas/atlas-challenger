import express from "express";
import {
  getStudents,
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
import { registerList } from "@/controllers/studentsControllers/studentsList";

const router = express.Router();

router.post("/students", createStudent);

router.put(
  "/students",
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

// studentList

router.get(
  "/students/registerList/:id",
  authentication,
  authorizeRoles("student"),
  registerList,
);


export { router };
