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

const router = express.Router();

router.post("/instructors", createInstructor);

router.put(
  "/instructors",
  authentication,
  authorizeRoles("instructor"),
  updateInstructor,
);

router.delete(
  "/instructors",
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

export { router };
