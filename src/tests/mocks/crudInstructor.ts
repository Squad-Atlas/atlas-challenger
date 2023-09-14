import { Request, Response } from "express";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import InstructorModel from "@/models/instructor";

export const deleteInstructorTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError("Please provide a valid id");
    }

    const deletedInstructor = await InstructorModel.findByIdAndDelete(id);

    if (deletedInstructor === null) {
      throw new NotFoundError("Instructor not found");
    }

    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

export const updateInstructorTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError("Please provide a valid id");
    }

    const instructorExists = await InstructorModel.exists({ _id: id });

    if (!instructorExists) {
      throw new NotFoundError("Instructor not found");
    }

    const updatedInstructor = {
      _id: id,
      name: "Updated Instructor",
      email: "updatedinstructoremail@example.com",
      phone: "1234567890",
      user: "UpdatedInstructorUser",
      password: "UpdatedInstructorPassword",
      role: "instructor",
    };

    res.status(200).json({
      message: "Instructor updated successfully",
      data: updatedInstructor,
    });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
