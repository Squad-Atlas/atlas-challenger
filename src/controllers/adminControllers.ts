import { Request, Response } from "express";
import InstructorModel, { Instructor } from "@/models/instructor";
import StudentModel, { Student } from "@/models/student";

export const getInstructors = async (_req: Request, res: Response) => {
  const instructors: Instructor[] = await InstructorModel.find();
  res.status(200).json(instructors);
};

export const getStudents = async (_req: Request, res: Response) => {
  const students: Student[] = await StudentModel.find();
  res.status(200).json(students);
};
