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
  // unsubscribeInstructor,
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
  "/students/enrollSubject/:studentId/:instructorId",
  authentication,
  authorizeRoles("student"),
  enrollSubject,
);

// router.post(
//   "/students/unsubscribeInstructor/:id",
//   authentication,
//   authorizeRoles("student"),
//   unsubscribeInstructor,
// );

export { router };
