import { Request, Response } from "express";
import InstructorModel, { Instructor } from "@/models/instructor";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import mongoose from "mongoose";
import "express-async-errors";
import { validateFields } from "@/utils/validationUtils";
import StudentModel from "@/models/student";

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
 *
 */

export const createInstructor = async (req: Request, res: Response) => {
  const newInstructorData: Instructor = req.body;

  const validationErrors = validateFields(newInstructorData);

  if (validationErrors.msgErrors) {
    throw new BadRequestError(validationErrors.msgErrors);
  }

  const isRepeatedUser = await StudentModel.findOne({
    $or: [
      { user: req.body.user },
      { phone: req.body.phone },
      { email: req.body.email },
    ],
  });

  if (isRepeatedUser) {
    throw new BadRequestError("User already registered.");
  }

  const newInstructor: Instructor = new InstructorModel(newInstructorData);
  await newInstructor.save();

  res.status(201).json(newInstructor);
};

/**
 * @swagger
 * /instructors/{id}:
 *  put:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Instructor
 *    summary: Update a Instructor
 *    description: Update an instructor by id
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
 *            $ref: '#/components/schemas/Instructor'
 *    responses:
 *      200:
 *        description: Sucess update instructor
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/InstructorResponse"
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
 *                message:
 *                  type: string
 *                  default: Instructor not found
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

export const updateInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw new BadRequestError("Please provide a valid id.");

  const newInstructorData: Instructor = req.body;
  const validationErrors = validateFields(newInstructorData);

  if (validationErrors.msgErrors) {
    throw new BadRequestError(validationErrors.msgErrors);
  }

  const updatedInstructor: Instructor | null =
    await InstructorModel.findByIdAndUpdate(id, newInstructorData, {
      new: true,
    });

  if (!updatedInstructor) throw new NotFoundError("Instructor not found!");

  if (newInstructorData.password) {
    updatedInstructor.password = newInstructorData.password;
    await updatedInstructor.save();
  }

  res.status(200).json(updatedInstructor);
};

/**
 * @swagger
 * /instructors/{id}:
 *  delete:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
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
 *                  default: Instructor not found
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

export const deleteInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id))
    throw new BadRequestError("Please provide a valid id");

  const deletedInstructor = await InstructorModel.findByIdAndDelete(id);

  if (!deletedInstructor) throw new NotFoundError("Instructor not found!");

  res.status(200).json({ message: "Instructor deleted successfully" });
};
