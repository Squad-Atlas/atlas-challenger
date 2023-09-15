import { NotFoundError } from "@/helpers/api-errors";
import ClassroomModel from "@/models/classroom";
import { Request, Response } from "express";

/**
 * @swagger
 * /instructors/getClassroom/{id}:
 *  get:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Instructor
 *    summary: Return of information from the teacher's class
 *    description: Return of information from the teacher's class
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the instructor
 *        required: true
 *    responses:
 *      200:
 *        description: Returns class document
 *      404:
 *        description: Classroom not found!
 *      500:
 *        description: Internal Server Error
 *
 */

export const getClassroom = async (req: Request, res: Response) => {
  const getClassroom = await ClassroomModel.find({
    instructor: req.params.id,
  });

  if (!getClassroom) throw new NotFoundError("Classroom not found!");

  return res.status(200).json(getClassroom);
};

export const updateClassroom = async (req: Request, res: Response) => {
  const updateClassroom = await ClassroomModel.findByIdAndUpdate(
    req.params.id,
    req.body,
  );
  return res.status(200).json(updateClassroom);
};

/**
 * @swagger
 * /instructors/deleteClassroom/{id}:
 *  delete:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Instructor
 *    summary: Delete a teacher's class
 *    description: Delete a teacher's class
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the instructor
 *        required: true
 *    responses:
 *      200:
 *        description: Successfully deleted
 *      404:
 *        description: Classroom not found!
 *      500:
 *        description: Internal Server Error
 *
 */

export const deleteClassroom = async (req: Request, res: Response) => {
  const deleteClassroom = await ClassroomModel.findByIdAndDelete(req.params.id);

  if (!deleteClassroom) throw new NotFoundError("Classroom not found!");

  return res.status(200).json({ message: "Classroom deleted successfully" });
};
