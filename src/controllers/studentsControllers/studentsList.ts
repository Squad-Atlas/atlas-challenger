import { NotFoundError } from "@/helpers/api-errors";
import ClassroomModel from "@/models/classroom";
import { Request, Response } from "express";

/**
 * @swagger
 * /students/listClassroom/{id}:
 *  get:
 *    security:
 *      - cookieAuth: []
 *      - bearerAuth: []
 *    tags:
 *      - Student
 *    summary: Return of classes for which the student is registered
 *    description: Return list of registered classes
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The id of the student
 *        required: true
 *    responses:
 *      200:
 *        description: Return list of registered classes
 *      404:
 *        description: Student not found!
 *      500:
 *        description: Internal Server Error
 *
 */

export const listClassroom = async (req: Request, res: Response) => {
  const listClassroom = await ClassroomModel.find(
    {
      students: req.params.id,
    },
    {
      _id: 0,
      students: 0,
      documents: 0,
    },
  );
  if (!listClassroom) throw new NotFoundError("Student not found!");
  return res.status(200).json(listClassroom);
};
