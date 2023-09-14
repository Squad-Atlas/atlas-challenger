import { Request, Response } from "express";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import StudentModel from "@/models/student";

export const deleteStudentTest = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    try {
      throw new BadRequestError("Please provide a valid id");
    } catch (error) {
      res.status(400).json({ message: "Please provide a valid id" });
      return;
    }
  }

  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(id);

    if (deletedStudent === null) {
      try {
        throw new NotFoundError("Student not found!");
      } catch (error) {
        res.status(404).json({ error: "Student not found!" });
        return;
      }
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    throw new Error("An unexpected error occurred while deleting the student");
  }
};

export const updateStudentTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError("Please provide a valid id");
    }

    const studentExists = await StudentModel.exists({ _id: id });

    if (!studentExists) {
      throw new NotFoundError("Student not found");
    }

    const updatedStudent = {
      _id: id,
      name: "Updated Student",
      email: "updatedemail@example.com",
      phone: "1234567890",
      user: "UpdatedUser",
      password: "UpdatedPassword",
      role: "student",
    };

    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
