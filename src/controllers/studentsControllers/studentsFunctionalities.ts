import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import StudentModel, { Student } from "@/models/student";
import { conflictTime, IconflictTime } from "@/utils/hours";
import { StudentFileModel } from "@/models/studentsFile";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";

export const listSubjects = async (req: Request, res: Response) => {
  const listSubjects: Classroom[] = await ClassroomModel.find()
    .populate({ path: "instructor", select: "name" })
    .select("subject schedule");
  return res.status(200).json(listSubjects);
};

export const enrollSubject = async (req: Request, res: Response) => {
  const { studentId, classRoomId } = req.params;
  const { day, startTime, endTime } = req.query as {
    day: string;
    startTime: string;
    endTime: string;
  };

  if (
    !mongoose.isValidObjectId(classRoomId) ||
    !mongoose.isValidObjectId(studentId)
  )
    throw new BadRequestError("Please provide a valid id.");

  const student: Student | null = await StudentModel.findById(studentId)
    .select("classroom")
    .populate("classroom");

  if (!student) {
    throw new NotFoundError("Student not found!");
  }

  const classroom: Classroom | null = await ClassroomModel.findById(
    classRoomId,
  );

  if (!classroom) {
    throw new NotFoundError("Classroom not found!");
  }

  const ownClassDay = student.classroom.find((el) =>
    el.schedule.some((schedule) => schedule.day === day),
  );

  if (classroom.students.includes(student.id)) {
    throw new BadRequestError("You are already subscribed to this teacher");
  }

  if (ownClassDay) {
    const times: IconflictTime[] = [];
    for (const classroom of student.classroom) {
      for (const schedule of classroom.schedule) {
        if (schedule.day === day) {
          times.push({
            startTime: schedule.startTime,
            endTime: schedule.endTime,
          });
        }
      }
    }

    if (conflictTime(startTime, endTime, times)) {
      throw new BadRequestError(
        "Unfortunately this class is in conflict with another class!",
      );
    }
  }

  if (classroom.students.length < 30) {
    await ClassroomModel.findByIdAndUpdate(classRoomId, {
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

export const unrollSubject = async (req: Request, res: Response) => {
  const { studentId, classRoomId } = req.params;

  if (
    !mongoose.isValidObjectId(studentId) ||
    !mongoose.isValidObjectId(classRoomId)
  )
    throw new BadRequestError("Please provide a valid id.");

  const classroom: Classroom | null = await ClassroomModel.findById(
    classRoomId,
  );

  if (!classroom) {
    throw new NotFoundError("Student not found!");
  }

  const student: Student | null = await StudentModel.findById(studentId);

  if (!student) {
    throw new NotFoundError("Student not found!");
  }

  if (!student.classroom.includes(classroom._id)) {
    throw new NotFoundError("You are not enrolled in this class!");
  }

  await ClassroomModel.findByIdAndUpdate(classRoomId, {
    $pull: { students: student._id },
  });

  await StudentModel.findByIdAndUpdate(studentId, {
    $pull: { classroom: classroom._id },
  });

  return res.status(200).json({ message: "You canceled your subscription" });
};

export const studentUploadFile = async (req: Request, res: Response) => {
  const { studentId, classRoomId } = req.params;
  const txt = req.files!.studentFile as UploadedFile;

  if (
    !mongoose.isValidObjectId(classRoomId) ||
    !mongoose.isValidObjectId(studentId)
  )
    throw new BadRequestError("Please provide a valid id.");

  const student: Student | null = await StudentModel.findById(studentId);

  if (!student) {
    throw new NotFoundError("Student not found!");
  }

  const classroom: Classroom | null = await ClassroomModel.findById(classRoomId)
    .select("documents")
    .populate("documents");

  if (!classroom) {
    throw new NotFoundError("Classroom not found!");
  }

  if (!txt) {
    throw new BadRequestError(
      "Something went wrong when uploading file. No file posted to be uploaded.",
    );
  }

  if (
    !txt.name.endsWith("pdf") ||
    !txt.name.endsWith("docx") ||
    !txt.name.endsWith("txt")
  ) {
    throw new BadRequestError("Please, try uploading a valid file type");
  }
  txt.mv(`../../temp/${txt.name}`, (err) => {
    if (err) {
      throw new InternalServerError(`Failed to move file: ${err}`);
    }
    res.status(200).json({ message: "Success! File uploaded" });
  });
  const File = new StudentFileModel({
    authorId: studentId,
    fileName: txt.name,
    filePath: `../../temp/${txt.name}`,
    fileObject: txt,
  });
  await ClassroomModel.findByIdAndUpdate(classRoomId, {
    $push: { documents: File },
  });
};
