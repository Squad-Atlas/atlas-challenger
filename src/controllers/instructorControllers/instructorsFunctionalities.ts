import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import ClassroomModel, { Classroom } from "@/models/classroom";
import InstructorModel, { Instructor } from "@/models/instructor";
import StudentModel, { Student } from "@/models/student";
import { Request, Response } from "express";
import mongoose from "mongoose";

/**
 * @swagger
 * /instructors/listStudents/{id}:
 *  get:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Instructor
 *    summary: List registered students
 *    description: Returns list of students enrolled in a teacher's class
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the instructor
 *        required: true
 *    responses:
 *      200:
 *        description: List of student documents
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                Students:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/ListStudents"
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Instructor not found!
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

/**
 * @swagger
 * /instructors/registerClass/{id}:
 *  post:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Instructor
 *    summary: Register a class
 *    description: Register a class with information about the subject, time and class link
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the instructor
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/InstructorClass'
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
 *                  default: Class registered successfully
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: The teacher already has a subject registered!
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Instructor not found!
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

/**
 * @swagger
 * /instructors/unsubscribeStudent/{instructorId}/{studentId}:
 *  delete:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Instructor
 *    summary: Unsubscribe student from a class
 *    description: Remove student registered in a teacher's class.
 *    parameters:
 *      - name: instructorId
 *        in: path
 *        description: The id of the instructor
 *        required: true
 *      - name: studentId
 *        in: path
 *        description: The id of the student
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
 *                  default: Unsubscribe student successfully
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
 *                  default: This student is not enrolled in your class!
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
