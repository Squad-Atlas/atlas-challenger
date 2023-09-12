import express from "express";

import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "@/controllers/instructorController";

import {
  listStudents,
  registerClass,
} from "@/controllers/instructorControllers/instructorsFunctionalities";

import { authentication, authorizeRoles } from "@/middlewares/authentication";

const router = express.Router();

router.post("/instructors", createInstructor);

router.put(
  "/instructors/:id",
  authentication,
  authorizeRoles("instructor"),
  updateInstructor,
);
router.get(
  "/instructors",
  authentication,
  authorizeRoles("student", "instructor"),
  getInstructors,
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

export { router };
