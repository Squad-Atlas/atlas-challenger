import { Request, Response } from "express";
import StudentModel, { Student } from "@/models/student";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import mongoose from "mongoose";

/**
 * @swagger
 * /students:
 *  get:
 *    tags:
 *      - Student
 *    summary: Get all students
 *    description: Returns a list of all students
 *    responses:
 *      200:
 *        description: A list of students
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/StudentResponse"
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
 */

export const getStudents = async (_req: Request, res: Response) => {
  const students: Student[] = await StudentModel.find();
  res.status(200).json(students);
};

/**
 * @swagger
 * /students:
 *  post:
 *    tags:
 *      - Student
 *    summary: Create a student
 *    description: Return a new document student
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses:
 *      201:
 *        description: Document student
 *        content:
 *          application/json:
 *            schema:
 *                $ref: "#/components/schemas/StudentResponse"
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Make sure that all fields have been filled out.
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
 */

export const createStudent = async (req: Request, res: Response) => {
  const { name, email, phone, user, password } = req.body;

  if (!name || !email || !phone || !user || !password) {
    throw new BadRequestError(
      "Make sure that all fields have been filled out.",
    );
  }

  const student = {
    name,
    email,
    phone,
    user,
    password,
  };

  const newStudent: Student = new StudentModel(student);
  await newStudent.save();
  res.status(201).json(newStudent);
};

/**
 * @swagger
 * /students/{id}:
 *  put:
 *    tags:
 *      - Student
 *    summary: Update a student
 *    description: Update an student by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the student
 *        requuired: true
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Student'
 *    responses:
 *      200:
 *        description: Sucess update student
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/StudentResponse"
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
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Student not found
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

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw new BadRequestError("Please provide a valid id");

  const updatedStudent = await StudentModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedStudent) throw new NotFoundError("Student not found!");

  res.status(200).json(updatedStudent);
};

/**
 * @swagger
 * /students/{id}:
 *  delete:
 *    tags:
 *      - Student
 *    summary: Delete a student
 *    description: Delete an student by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the student
 *        requuired: true
 *    responses:
 *      200:
 *        description: Success delete student
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Student deleted successfully
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
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Student not found
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
 */

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw new BadRequestError("Please provide a valid id");

  const deletedStudent = await StudentModel.findByIdAndDelete(id);

  if (!deletedStudent) throw new NotFoundError("Student not found!");

  res.status(200).json({ message: "Student deleted successfully" });
};
