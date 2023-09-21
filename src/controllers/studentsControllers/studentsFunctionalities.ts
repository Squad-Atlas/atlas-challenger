import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import StudentModel, { Student } from "@/models/student";
import { conflictTime, IconflictTime } from "@/utils/hours";
import { sendMailSubscription } from "@/utils/sendEmail";
import { StudentFileModel } from "@/models/studentsFile";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import mongoose from "mongoose";
import path from "path";

/**
 * @swagger
 * /students/listSubjects:
 *  get:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Student
 *    summary: List classes
 *    description: Returns a list of registered classes
 *    parameters:
 *      - name: filter
 *        in: query
 *        required: false
 *        schema:
 *          type: string
 *        description: Filter to search subject name or class day
 *    responses:
 *      200:
 *        description: List of classes documents
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/ListSubjects"
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Internal Server Error
 *
 */

export const listSubjects = async (req: Request, res: Response) => {
  const filter = req.query.filter;

  const queryFilter = filter
    ? {
        $or: [
          { subject: { $regex: filter, $options: "i" } },
          { "schedule.day": { $regex: filter, $options: "i" } },
        ],
      }
    : {};

  const listSubjects: Classroom[] = await ClassroomModel.find(queryFilter)
    .select("subject schedule instructor")
    .populate({
      path: "instructor",
      select: "name",
    });

  return res.status(200).json(listSubjects);
};

/**
 * @swagger
 * /students/enrollSubject/{studentId}/{classRoomId}:
 *  post:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Student
 *    summary: Sign up for a class
 *    description: Registering for a class, if successful, an e-mail will be sent to the student with information about the class.
 *    parameters:
 *      - name: studentId
 *        in: path
 *        description: The id of the student
 *        required: true
 *      - name: classRoomId
 *        in: path
 *        description: The id of the classroom
 *        required: true
 *      - name: day
 *        in: query
 *        schema:
 *          type: string
 *          example: "Monday"
 *        description: Class day
 *      - name: startTime
 *        in: query
 *        schema:
 *          type: string
 *          example: "09:30"
 *        description: Class start time
 *      - name: endTime
 *        in: query
 *        schema:
 *          type: string
 *          example: "10:20"
 *        description: Class ending time
 *    responses:
 *      200:
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Congratulations on the inscription
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Please provide a valid id.
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Student not found!
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Internal Server Error
 *
 */

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
  ).populate("instructor");

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

    const studentUser = await StudentModel.findByIdAndUpdate(studentId, {
      $push: { classroom: classroom },
    });

    if (!studentUser) throw new NotFoundError("Student not found!");

    sendMailSubscription(studentUser, classroom, day, startTime, endTime);

    return res
      .status(200)
      .json({ message: "Congratulations on the inscription" });
  }
  throw new BadRequestError(
    "Unfortunately, the course already has all vacancies occupied",
  );
};

/**
 * @swagger
 * /students/unrollSubject/{studentId}/{classRoomId}:
 *  patch:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Student
 *    summary: Unsubscribe student from a class
 *    description: Unsubscribe student from a class
 *    parameters:
 *      - name: studentId
 *        in: path
 *        description: The id of the student
 *        required: true
 *      - name: classRoomId
 *        in: path
 *        description: The id of the classroom
 *        required: true
 *    responses:
 *      200:
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: You canceled your subscription
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Please provide a valid id.
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: You are not enrolled in this class!
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Internal Server Error
 *
 */

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

/**
 * @swagger
 * /students/uploadAssignment/{studentId}/{classRoomId}:
 *  post:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Student
 *    summary: Upload student files
 *    description: Sending student documents, which are restricted to pdf, docs, txt and size up to 3 mb
 *    parameters:
 *      - name: studentId
 *        in: path
 *        description: The id of the student
 *        required: true
 *      - name: classRoomId
 *        in: path
 *        description: The id of the classroom
 *        required: true
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *               studentFile:
 *                type: file
 *    responses:
 *      200:
 *        description: Ok
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Success! File uploaded
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Something went wrong when uploading file. No file posted to be uploaded.
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Student not found!
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Internal Server Error
 *
 */

export const studentUploadFile = async (req: Request, res: Response) => {
  const { studentId, classRoomId } = req.params;
  let file = undefined;

  if (req.files) {
    file = req.files.studentFile as UploadedFile;
  } else {
    throw new BadRequestError(
      "Something went wrong when uploading file. No file posted to be uploaded.",
    );
  }

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

  if (file.size > 1024 * 1024 * 3) {
    throw new BadRequestError(
      "File size too big, provide a file with size less or equal than 3MB.",
    );
  }

  if (
    !file.name.endsWith("pdf") &&
    !file.name.endsWith("docx") &&
    !file.name.endsWith("txt")
  ) {
    throw new BadRequestError(
      "Please, try uploading a valid file type (pdf, docx, txt).",
    );
  }

  const actualTime = `${new Date().getHours().toString()}-${new Date()
    .getMinutes()
    .toString()}-${new Date().getSeconds().toString()}`;

  let extension;

  if (file.name.endsWith("docx")) {
    extension = file.name.slice(-5);
  } else {
    extension = file.name.slice(-4);
  }

  const newFileName = `${file.name.slice(0, -4)}-${actualTime}${extension}`;

  file.name = newFileName;

  const filePath = path.join(__dirname, "../../../temp/" + `${file.name}`);

  file.mv(filePath, (err: Error) => {
    if (err) {
      throw new InternalServerError(`Failed to move file: ${err.message}`);
    }
  });
  const File = new StudentFileModel({
    authorId: studentId,
    fileName: file.name,
    filePath: `../../temp/${file.name}`,
  });

  await File.save();

  await ClassroomModel.findByIdAndUpdate(classRoomId, {
    $push: { documents: File },
  });

  res.status(200).json({ message: "Success! File uploaded" });
};
