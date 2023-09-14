import express from "express";

import {
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "@/controllers/instructorController";

import {
  listStudents,
  registerClass,
  unsubscribeStudent,
} from "@/controllers/instructorControllers/instructorsFunctionalities";

import { authentication, authorizeRoles } from "@/middlewares/authentication";
import {
  getClassroom,
  deleteClassroom,
  updateClassroom,
} from "@/controllers/instructorControllers/instructorList";

const router = express.Router();

router.post("/instructors", createInstructor);

router.put(
  "/instructors/:id",
  authentication,
  authorizeRoles("instructor"),
  updateInstructor,
);

router.delete(
  "/instructors/:id",
  authentication,
  authorizeRoles("instructor"),
  deleteInstructor,
);

// instructorsFunctionalities

router.get(
  "/instructors/listStudents/:id",
  authentication,
  authorizeRoles("instructor"),
  listStudents,
);

router.post(
  "/instructors/registerClass/:id",
  authentication,
  authorizeRoles("instructor"),
  registerClass,
);

router.delete(
  "/instructors/unsubscribeStudent/:instructorId/:studentId",
  authentication,
  authorizeRoles("instructor"),
  unsubscribeStudent,
);

// instructorList

router.get(
  "/instructors/getClassroom/:id",
  authentication,
  authorizeRoles("instructor"),
  getClassroom,
);

router.post(
  "/instructors/updateClassroom/:id",
  authentication,
  authorizeRoles("instructor"),
  updateClassroom,
);

router.delete(
  "/instructors/deleteClassroom/:id",
  authentication,
  authorizeRoles("instructor"),
  deleteClassroom,
);

export { router };
