import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import InstructorModel, { Instructor } from "@/models/instructor";
import StudentModel, { Student } from "@/models/student";
import { conflictTime, IconflictTime } from "@/utils/hours";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const listSubjects = async (req: Request, res: Response) => {
  const listSubjects: Classroom[] = await ClassroomModel.find()
    .populate({ path: "instructor", select: "name" })
    .select("subject schedule -_id");
  return res.status(200).json(listSubjects);
};

export const enrollSubject = async (req: Request, res: Response) => {
  const { studentId, instructorId } = req.params;
  const { day, startTime, endTime } = req.query as {
    day: string;
    startTime: string;
    endTime: string;
  };

  if (
    !mongoose.isValidObjectId(instructorId) ||
    !mongoose.isValidObjectId(studentId)
  )
    throw new BadRequestError("Please provide a valid id.");

  const student: Student | null = await StudentModel.findById(studentId)
    .select("classroom")
    .populate("classroom");

  if (!student) {
    throw new NotFoundError("Student not found!");
  }

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
      },
    });

  if (!instructor) {
    throw new NotFoundError("Instructor not found!");
  }

  const classroomId = instructor.classroom._id;

  const classroom: Classroom | null = await ClassroomModel.findById(
    classroomId,
  );

  if (!classroom) {
    throw new NotFoundError("Classroom not found!");
  }
  const ownClassDay = student.classroom.find((el) =>
    el.schedule.some((schedule) => schedule.day === day),
  );

  const index = instructor.classroom.students.findIndex((aluno) => {
    return aluno.id.trim() === student.id.trim();
  });

  if (index !== -1) {
    throw new BadRequestError("You are already subscribed to this teacher");
  }

  if (ownClassDay) {
    const times: IconflictTime[] = [];
    for (const classroom of student.classroom) {
      for (const schedule of classroom.schedule) {
        // Pegar horario somente do dia da aula
        times.push({
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        });
      }
    }

    if (conflictTime(startTime, endTime, times)) {
      throw new BadRequestError(
        "Unfortunately this class is in conflict with another class!",
      );
    }
  }

  if (instructor.classroom.students.length < 30) {
    const classroom = await ClassroomModel.findByIdAndUpdate(classroomId, {
      $push: { students: student },
    });

    await StudentModel.findByIdAndUpdate(studentId, {
      $push: { classroom: classroom },
    });

    return res
      .status(200)
      .json({ message: "Congratulations on the inscription" });
  }
  throw new BadRequestError(
    "Unfortunately, the course already has all vacancies occupied",
  );
};

// export const unsubscribeInstructor = async (req: Request, res: Response) => {
//   const instructorId = req.params.id;
//   const studentId = (req as Payload).user._id;

//   if (!mongoose.isValidObjectId(instructorId))
//     throw new BadRequestError("Please provide a valid id.");

//   const student: Student | null = await StudentModel.findById(studentId);

//   if (!student) {
//     throw new NotFoundError("Student not found!");
//   }

//   const instructor: Instructor | null = await InstructorModel.findById(
//     instructorId,
//   );

//   if (!instructor) {
//     throw new NotFoundError("Instructor not found!");
//   }
//   const objectStudentId = new mongoose.Types.ObjectId(student._id);

//   if (!instructor.students.includes(objectStudentId)) {
//     throw new BadRequestError("You are not subscribed to this teacher");
//   }

//   await InstructorModel.findByIdAndUpdate(instructorId, {
//     $pull: { students: student._id },
//   });

//   return res.status(200).json({ message: "You canceled your subscription" });
// };
