import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import InstructorModel, { Instructor } from "@/models/instructor";
import { Request, Response } from "express";

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
