import { Request, Response } from "express";
import StudentModel from "../models/student";

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const newStudent = new StudentModel(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to create student" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to update student" });
  }
};


export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};