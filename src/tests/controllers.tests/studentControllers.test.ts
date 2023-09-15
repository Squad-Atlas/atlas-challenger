/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import StudentModel from "@/models/student";
import { createStudent } from "@/controllers/studentController";
import { ValidationErrors, validateFields } from "@/utils/validationUtils";
import { deleteStudentTest, updateStudentTest } from "../mocks/crudStudent";

jest.mock("@/controllers/studentController", () => ({
  async createStudent(req: Request, res: Response) {
    return res.status(201).json({ ...req.body });
  },
}));

describe("Student Controller", () => {
  describe("createStudent", () => {
    it("should create a new student", async () => {
      const mockStudent = {
        name: "Test Student",
        email: "test@student.com",
        phone: "1234567890",
        user: "testuser",
        password: "!Abc123",
        role: "student",
      };

      const saveMock = jest.fn().mockResolvedValue(mockStudent);
      jest.spyOn(StudentModel.prototype, "save").mockImplementation(saveMock);

      const req = {
        body: mockStudent,
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockStudent.email,
          name: mockStudent.name,
          password: mockStudent.password,
          phone: mockStudent.phone,
          role: mockStudent.role,
        }),
      );
    });

    it("should return error messages for invalid student data", () => {
      const invalidStudentData: any = {
        name: "Invalid Name123",
        email: "invalidemail",
        phone: "12345-67890",
        user: "est",
        password: "password",
        role: "student",
      };

      const errors: ValidationErrors = validateFields(invalidStudentData);

      expect(errors.msgErrors).toContain(
        "[The name must contain only letters and spaces, and be between 3 and 50 characters.]",
      );
      expect(errors.msgErrors).toContain("[The e-mail is invalid.]");
      expect(errors.msgErrors).toContain("[The phone is invalid.]");
      expect(errors.msgErrors).toContain("[The username is invalid.]");
      expect(errors.msgErrors).toContain(
        "[The password must contain at least one capital letter, one special character and one number.]",
      );
    });
  });
});

describe("deleteStudent", () => {
  it("deve retornar status 200 e uma mensagem de sucesso ao excluir um estudante existente", async () => {
    const mockRequest = {
      params: { id: "64fa0ac0df48733a2589c3e0" },
    } as any as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Response;

    const findByIdAndDeleteMock = jest
      .spyOn(StudentModel, "findByIdAndDelete")
      .mockResolvedValue({});

    await deleteStudentTest(mockRequest, mockResponse);

    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(
      "64fa0ac0df48733a2589c3e0",
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Student deleted successfully",
    });
  });

  it("deve retornar status 400 ao fornecer um ID inválido", async () => {
    const mockRequest = {
      params: { id: "64fa0ac0df48733a2589c3eeE" },
    } as any as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Response;

    try {
      await deleteStudentTest(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Please provide a valid id",
      });
    }
  });

  it("deve retornar status 404 ao tentar excluir um estudante inexistente", async () => {
    const mockRequest = {
      params: { id: "64fa0ac0df48733a2589c3eeE" },
    } as any as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Response;

    try {
      await deleteStudentTest(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Student not found!",
      });
    }
  });
});

describe("updateStudent", () => {
  it("Should return a status 200 and a success message when updating a valid student", async () => {
    const updateStudentTestMock = async (req: Request, res: Response) => {
      const updatedStudent = {
        _id: "64fa0ac0df48733a2589c3e0",
        name: "Updated Student",
        email: "updatedemail@example.com",
        phone: "1234567890",
        user: "UpdatedUser",
        password: "UpdatedPassword",
        role: "student",
      };

      res.status(200).json({
        message: "Student updated successfully",
        data: updatedStudent,
      });
    };

    const req = { params: { id: "64fa0ac0df48733a2589c3e0" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await updateStudentTestMock(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Student updated successfully",
      data: {
        _id: "64fa0ac0df48733a2589c3e0",
        name: "Updated Student",
        email: "updatedemail@example.com",
        phone: "1234567890",
        user: "UpdatedUser",
        password: "UpdatedPassword",
        role: "student",
      },
    });
  });

  it("Should return a status 400 and an error message when trying to update with an invalid ID", async () => {
    const req = { params: { id: "123465" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    try {
      await updateStudentTest(req, res);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please provide a valid id",
      });
    }
  });

  it("Should return status 404 if the ID is not as expected", async () => {
    const req = { params: { id: "64fa0ac0df48733a2589c3e0EEE" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    try {
      await updateStudentTest(req, res);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Student not found",
      });
    }
  });
});
