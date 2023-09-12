import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import StudentModel, { Student } from "@/models/student";
import { conflictTime, IconflictTime } from "@/utils/hours";
import { sendMailSubscription } from "@/utils/sendEmail";
import { Request, Response } from "express";
import mongoose from "mongoose";

/**
 * @swagger
 * /students/listSubjects:
 *  get:
 *    tags:
 *      - Student
 *    summary: List classes
 *    description: Returns a list of registered classes
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
  const listSubjects: Classroom[] = await ClassroomModel.find()
    .populate({ path: "instructor", select: "name" })
    .select("subject schedule");
  return res.status(200).json(listSubjects);
};

/**
 * @swagger
 * /students/enrollSubject/{studentId}/{classRoomId}:
 *  post:
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
