import { Request, Response } from "express";
import StudentModel from "@/models/student";

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
 *        description: An error occurred
 */

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
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
 *      500:
 *        description: An error occurred
 */

export const createStudent = async (req: Request, res: Response) => {
  try {
    const newStudent = new StudentModel(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to create student" });
  }
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
 *
 */

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedStudent = await StudentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ error: "Failed to update student" });
  }
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
 *      404:
 *        description: Student not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Student not found
 *      500:
 *        description: Failed to delete student
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Failed to delete student
 */

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};
