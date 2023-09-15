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
  studentUploadFile,
} from "@/controllers/studentsControllers/studentsFunctionalities";

import { authentication, authorizeRoles } from "@/middlewares/authentication";
import { listClassroom } from "@/controllers/studentsControllers/studentsList";

const router = express.Router();

router.post("/students", createStudent);

router.put(
  "/students/:id",
  authentication,
  authorizeRoles("student"),
  updateStudent,
);

router.delete(
  "/students/:id",
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

router.patch(
  "/students/unrollSubject/:studentId/:classRoomId",
  authentication,
  authorizeRoles("student"),
  unrollSubject,
);

router.post(
  "/students/uploadAssignment/:studentId/:classRoomId",
  authentication,
  authorizeRoles("student"),
  studentUploadFile,
);

// studentList

router.get(
  "/students/listClassroom/:id",
  authentication,
  authorizeRoles("student"),
  listClassroom,
);

export { router };
