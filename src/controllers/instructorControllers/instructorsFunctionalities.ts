import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import InstructorModel, { Instructor } from "@/models/instructor";
import StudentModel, { Student } from "@/models/student";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const listStudents = async (req: Request, res: Response) => {
  const instructorId = req.params.id;

  const instructor: Instructor | null = await InstructorModel.findById(
    instructorId,
  )
    .select("classroom")
    .populate({
      path: "classroom",
      model: "Classroom",
      select: "students",
      populate: {
        path: "students",
        model: "Student",
        select: "name email phone",
      },
    });

  if (!instructor) {
    throw new NotFoundError("Instructor not found!");
  }

  if (!instructor.classroom) {
    throw new NotFoundError("You don't have any subject registered!");
  }

  res.status(200).json({ Students: instructor.classroom.students });
};

export const registerClass = async (req: Request, res: Response) => {
  const classroomData = req.body;
  const instructorId = req.params.id;

  let instructor = await InstructorModel.findByIdAndUpdate(instructorId);

  if (!instructor) {
    throw new NotFoundError("Instructor not found!");
  }

  if (instructor.classroom) {
    throw new BadRequestError("The teacher already has a subject registered!");
  }

  classroomData.instructor = instructor._id;
  const classRoom: Classroom = new ClassroomModel(classroomData);
  await classRoom.save();

  instructor = await InstructorModel.findByIdAndUpdate(instructorId, {
    classroom: classRoom,
  });

  res.status(200).json({ message: "Class registered successfully" });
};

export const unsubscribeStudent = async (req: Request, res: Response) => {
  const { instructorId, studentId } = req.params;

  if (
    !mongoose.isValidObjectId(instructorId) ||
    !mongoose.isValidObjectId(studentId)
  )
    throw new BadRequestError("Please provide a valid id.");

  const instructor: Instructor | null = await InstructorModel.findById(
    instructorId,
  )
    .select("classroom")
    .populate("classroom");

  if (!instructor) {
    throw new NotFoundError("Instructor not found!");
  }

  const student: Student | null = await StudentModel.findById(studentId);

  if (!student) {
    throw new NotFoundError("Student not found!");
  }

  if (!instructor.classroom.students.includes(student.id)) {
    throw new NotFoundError("This student is not enrolled in your class!");
  }

  await ClassroomModel.findByIdAndUpdate(instructor.classroom._id, {
    $pull: { students: student._id },
  });

  await StudentModel.findByIdAndUpdate(studentId, {
    $pull: { classroom: instructor.classroom._id },
  });

  res.status(200).json({ message: "Unsubscribe student successfully" });
};
