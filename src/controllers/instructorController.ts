import { Request, Response } from "express";
import InstructorModel from "@/models/instructor";
import { createInstructorToken, header } from "@/utils/createInstructorToken";

/**
 * @swagger
 * /instructors:
 *  get:
 *    tags:
 *      - Instructor
 *    summary: Get all instructors
 *    description: Returns a list of all instructors
 *    responses:
 *      200:
 *        description: A list of instructors
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/InstructorResponse"
 *      500:
 *        description: An error occurred
 */

export const getInstructors = async (_req: Request, res: Response) => {
  try {
    const instructors = await InstructorModel.find();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
};

/**
 * @swagger
 * /instructors:
 *  post:
 *    tags:
 *      - Instructor
 *    summary: Create a Instructor
 *    description: Return a new document instructor
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Instructor'
 *    responses:
 *      201:
 *        description: Document instructor
 *        content:
 *          application/json:
 *            schema:
 *                $ref: "#/components/schemas/InstructorResponse"
 *
 *
 */

export const createInstructor = async (req: Request, res: Response) => {
  try {
    const newInstructor = new InstructorModel(req.body);
    await newInstructor.save();
    createInstructorToken(newInstructor);
    res.status(201).json(newInstructor);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to create instructor" });
  }
};

/**
 * @swagger
 * /instructors/{id}:
 *  put:
 *    tags:
 *      - Instructor
 *    summary: Update a Instructor
 *    description: Update an instructor by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the instructor
 *        requuired: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Instructor'
 *    responses:
 *      200:
 *        description: Sucess update instructor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InstructorResponse"
 *      404:
 *        description: Instructor not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Instructor not found
 *
 */

export const updateInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedInstructor = await InstructorModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json(updatedInstructor);
  } catch (error) {
    res.status(400).json({ error: "Failed to update instructor" });
  }
};

/**
 * @swagger
 * /instructors/{id}:
 *  delete:
 *    tags:
 *      - Instructor
 *    summary: Delete a Instructor
 *    description: Delete an instructor by id
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the instructor
 *        requuired: true
 *    responses:
 *      200:
 *        description: Success delete instructor
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  default: Instructor deleted successfully
 *      404:
 *        description: Instructor not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Instructor not found
 *      500:
 *        description: Failed to delete instructor
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  default: Failed to delete instructor
 */

export const deleteInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedInstructor = await InstructorModel.findByIdAndDelete(id);
    if (!deletedInstructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }
    header.delete("token");
    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete instructor" });
  }
};
