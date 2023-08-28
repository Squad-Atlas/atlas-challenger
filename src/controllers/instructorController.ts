import { Request, Response } from "express";
import InstructorModel from "@/models/instructor";
import { createInstructorToken, header } from "@/utils/createInstructorToken";

export const getInstructors = async (_req: Request, res: Response) => {
  try {
    const instructors = await InstructorModel.find();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
};

export const createInstructor = async (req: Request, res: Response) => {
  try {
    const newInstructor = new InstructorModel(req.body);
    await newInstructor.save();
    createInstructorToken(newInstructor);
    res.status(201).json(newInstructor);
  } catch (error) {
    res.status(400).json({ error: "Failed to create instructor" });
  }
};

export const updateInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedInstructor = await InstructorModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json(updatedInstructor);
  } catch (error) {
    res.status(400).json({ error: "Failed to update instructor" });
  }
};

export const deleteInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedInstructor = await InstructorModel.findByIdAndDelete(id);
    if (!deletedInstructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    header.delete("token");
    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete instructor" });
  }
};
