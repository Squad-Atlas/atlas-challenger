import express from "express";

import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructorController";

const router = express.Router();

router.post("/instructors", createInstructor);
router.put("/instructors/:id", updateInstructor);
router.get("/instructors", getInstructors);
router.delete("/instructors/:id", deleteInstructor);

export {router};
