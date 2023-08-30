import express from "express";

import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "@/controllers/instructorController";
import { authentication, authorizeRoles } from "@/middlewares/authentication";
const router = express.Router();

router.post("/instructors", createInstructor);
router.put(
  "/instructors",
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
  "/instructors",
  authentication,
  authorizeRoles("instructor"),
  deleteInstructor,
);

export { router };
