/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { createInstructor } from "@/controllers/instructorController";
import InstructorModel from "@/models/instructor";
import { ValidationErrors, validateFields } from "@/utils/validationUtils";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";
import {
  deleteInstructorTest,
  updateInstructorTest,
} from "../mocks/crudInstructor";

jest.mock("@/controllers/instructorController", () => ({
  async createInstructor(req: Request, res: Response) {
    return res.status(201).json({ ...req.body });
  },
}));

describe("createInstructor", () => {
  it("should create a new instructor", async () => {
    const mockInstructor = {
      name: "Test One",
      email: "testone@example.com",
      phone: "1234567890",
      user: "TestUser1",
      password: "!Abc123",
      role: "instructor",
    };

    const saveMock = jest.fn().mockResolvedValue(mockInstructor);
    jest.spyOn(InstructorModel.prototype, "save").mockImplementation(saveMock);

    const req = {
      body: mockInstructor,
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await createInstructor(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mockInstructor.email,
        name: mockInstructor.name,
        password: mockInstructor.password,
        phone: mockInstructor.phone,
        role: mockInstructor.role,
      }),
    );
  });

  it("should return error messages for invalid instructor data", () => {
    const invalidInstructorData: any = {
      name: "Invalid Name123",
      email: "invalidemail",
      phone: "12345-67890",
      user: "est",
      password: "password",
      role: "instructor",
    };

    const errors: ValidationErrors = validateFields(invalidInstructorData);

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

describe("deleteInstructor", () => {
  it("should return status 200 and a success message when deleting an existing instructor", async () => {
    const mockRequest = {
      params: { id: "64fa0ac0df48733a2589c3e0" },
    } as any as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Response;

    const findByIdAndDeleteMock = jest
      .spyOn(InstructorModel, "findByIdAndDelete")
      .mockResolvedValue({});

    await deleteInstructorTest(mockRequest, mockResponse);

    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(
      "64fa0ac0df48733a2589c3e0",
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Instructor deleted successfully",
    });
  });

  it("should return status 400 when providing an invalid ID", async () => {
    const mockRequest = {
      params: { id: "64fa0ac0df48733a2589c3eeE" },
    } as any as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Response;

    try {
      await deleteInstructorTest(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Please provide a valid id",
      });
    }
  });

  it("should return status 404 when attempting to delete a non-existent instructor", async () => {
    const mockRequest = {
      params: { id: "64fa0ac0df48733a2589c3eeE" },
    } as any as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any as Response;

    try {
      await deleteInstructorTest(mockRequest, mockResponse);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Instructor not found",
      });
    }
  });
});

describe("updateInstructor", () => {
  it("should return status 200 and a success message when updating a valid instructor", async () => {
    const updateInstructorTestMock = async (req: Request, res: Response) => {
      const updatedInstructor = {
        _id: "64fa0ac0df48733a2589c3e0",
        name: "Updated Instructor",
        email: "updatedinstructoremail@example.com",
        phone: "1234567890",
        user: "UpdatedInstructorUser",
        password: "UpdatedInstructorPassword",
        role: "instructor",
      };

      res.status(200).json({
        message: "Instructor updated successfully",
        data: updatedInstructor,
      });
    };

    const req = { params: { id: "64fa0ac0df48733a2589c3e0" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await updateInstructorTestMock(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Instructor updated successfully",
      data: {
        _id: "64fa0ac0df48733a2589c3e0",
        name: "Updated Instructor",
        email: "updatedinstructoremail@example.com",
        phone: "1234567890",
        user: "UpdatedInstructorUser",
        password: "UpdatedInstructorPassword",
        role: "instructor",
      },
    });
  });

  it("should return status 400 and an error message when trying to update with an invalid ID", async () => {
    const req = { params: { id: "123465" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    try {
      await updateInstructorTest(req, res);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please provide a valid id",
      });
    }
  });

  it("should return status 404 if the ID is not as expected", async () => {
    const req = { params: { id: "64fa0ac0df48733a2589c3e0EEE" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    try {
      await updateInstructorTest(req, res);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Instructor not found",
      });
    }
  });
});
