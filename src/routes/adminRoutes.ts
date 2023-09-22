import { getInstructors, getStudents } from "@/controllers/adminControllers";
import { authentication, authorizeRoles } from "@/middlewares/authentication";
import express from "express";

const router = express.Router();

router.get(
  "/admin/instructors/getInstructors",
  authentication,
  authorizeRoles("admin"),
  getInstructors,
);

router.get(
  "/admin/students/getStudents",
  authentication,
  authorizeRoles("admin"),
  getStudents,
);

export { router };
