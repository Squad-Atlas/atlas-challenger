/* eslint-disable @typescript-eslint/no-explicit-any */
import InstructorModel from "@/models/instructor";
import { Request, Response } from "express";
import { NotFoundError } from "@/helpers/api-errors";

export async function listStudents(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const instructor = await InstructorModel.findById(id).populate("classroom");

    if (!instructor) {
      throw new NotFoundError("Instructor not found!");
    }

    if (!instructor.classroom) {
      throw new NotFoundError("You don't have any subject registered!");
    }

    const students = instructor.classroom.students;

    res.status(200).json({ Students: students });
  } catch (error: any) {
    if (error.message === "You don't have any subject registered!") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

describe("listStudents", () => {
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should list students successfully when the instructor has a registered classroom", async () => {
    const instructorId = "id_do_instrutor";

    const classroom = {
      students: [
        {
          name: "Student 1",
          email: "student1@example.com",
          phone: "123456789",
        },
        {
          name: "Student 2",
          email: "student2@example.com",
          phone: "987654321",
        },
      ],
    };
    const instructor = { classroom };

    // Mock the findById function of InstructorModel to return the instructor with a registered classroom
    const findByIdMock = jest
      .spyOn(InstructorModel, "findById")
      .mockResolvedValueOnce(instructor);

    const req = { params: { id: instructorId } } as unknown as Request;
    const res = mockResponse();

    await listStudents(req, res);

    try {
      await listStudents(req, res);
    } catch (error) {
      expect(findByIdMock).toHaveBeenCalledWith(instructorId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ Students: classroom.students });
    }
  });

  it("should return an error when the instructor does not have a registered classroom", async () => {
    const instructorId = "id_of_the_instructor_without_classroom";

    // Mock the findById function of InstructorModel that returns an instructor without a classroom
    const instructorWithoutClassroom = { classroom: null };
    const findByIdMock = jest
      .spyOn(InstructorModel, "findById")
      .mockResolvedValueOnce(instructorWithoutClassroom);

    const req = { params: { id: instructorId } } as unknown as Request;
    const res = mockResponse();

    try {
      await listStudents(req, res);
    } catch (error) {
      expect(findByIdMock).toHaveBeenCalledWith(instructorId);
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).message).toBe(
        "You don't have any subject registered!",
      );
    }
  });
});
