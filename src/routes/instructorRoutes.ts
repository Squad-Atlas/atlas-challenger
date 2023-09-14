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
import { deleteList, getList, updateList } from "@/controllers/instructorControllers/instructorList";

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

// instructorList

router.get(
  
  "/instructors/getList/:id",
  authentication,
  authorizeRoles("instructor"),
  getList,
);

router.post(
  "/instructors/updateList/:id",
  authentication,
  authorizeRoles("instructor"),
  updateList,
);

router.delete(
  "/instructors",
  authentication,
  authorizeRoles("instructor"),
  deleteList,
);

router.delete(
  "/instructors/unsubscribeStudent/:instructorId/:studentId",
  authentication,
  authorizeRoles("instructor"),
  unsubscribeStudent,
);

export { router };
