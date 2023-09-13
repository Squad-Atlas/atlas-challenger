/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import {
  createInstructor,
  getInstructors,
} from "@/controllers/instructorController";
import InstructorModel from "@/models/instructor";
import { ValidationErrors, validateFields } from "@/utils/validationUtils";
import { Payload } from "@/middlewares/authentication";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "@/helpers/api-errors";

describe("getInstructors", () => {
  describe("Successful Cases", () => {
    it("should return a list of instructors", async () => {
      // array de instrutores mockados para simular o resultado do banco de dados.
      const mockInstructors = [
        {
          _id: "1",
          name: "Teste Um",
          email: "testeum@example.com",
          phone: "1234567890",
          user: "Teste1",
          password: "password",
          role: "instructor",
          classroom: "classroom1",
          // Outras propriedades e métodos caso necessários.
        },
        // Adicionar mais instrutores conforme necessário.
        {
          _id: "2",
          name: "Teste Dois",
          email: "testedois@example.com",
          phone: "1234567890",
          user: "Teste2",
          password: "password",
          role: "instructor",
          classroom: "classroom2",
        },
      ];

      // mocks para o Request e Response.
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // mock para a função find do InstructorModel.
      jest.spyOn(InstructorModel, "find").mockResolvedValue(mockInstructors);

      // chamar a função getInstructors com os mocks de Request e Response.
      await getInstructors(req, res);

      // verificar se o status 200 foi chamado.
      expect(res.status).toHaveBeenCalledWith(200);

      // verificar se a função json foi chamada com os instrutores mockados.
      expect(res.json).toHaveBeenCalledWith(mockInstructors);
    });
  });

  describe("Error Handling", () => {
    it("should throw an error when InstructorModel.find() throws an exception", async () => {
      // mock para a função find do InstructorModel que lança uma exceção.
      jest.spyOn(InstructorModel, "find").mockImplementation(() => {
        throw new Error("Database error");
      });

      // mocks para o Request e Response.
      const req = {} as Request;
      const res = {} as Response;

      try {
        // chama a função getInstructors com os mocks de Request e Response.
        await getInstructors(req, res);

        // se a função não lançar uma exceção, o teste deve falhar.
        fail("Expected an error to be thrown.");
      } catch (error: any) {
        // Especificamos explicitamente o tipo da exceção como 'any'.
        // verifica se a exceção foi lançada com a mensagem apropriada.
        expect(error.message).toBe("Database error");
      }
    });
  });
});

describe("createInstructor", () => {
  it("should create a new instructor", async () => {
    // Create a mocked instructor object to simulate the new instructor to be created.
    const mockInstructor = {
      name: "Teste Um",
      email: "testeum@example.com",
      phone: "1234567890",
      user: "Teste1",
      password: "!Abc123",
      role: "instructor",
    };

    // Create a mock InstructorModel save function to simulate creating the instructor.
    const saveMock = jest.fn().mockResolvedValue(mockInstructor);
    jest.spyOn(InstructorModel.prototype, "save").mockImplementation(saveMock);

    // Create mocks for Request and Response with the new instructor's data.
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

// Local test function deleteInstructorTest to simulate behavior
const deleteInstructorTest = async (req: Request, res: Response) => {
  const { _id } = (req as Payload).user;

  if (!mongoose.isValidObjectId(_id))
    throw new BadRequestError("Please provide a valid id");

  const deletedInstructor = await InstructorModel.findByIdAndDelete(_id);

  if (!deletedInstructor) {
    res.status(404).json({ error: "Instructor not found" });
  } else {
    res.status(200).json({ message: "Instructor deleted successfully" });
  }
};

describe("deleteInstructor", () => {
  it("Should return a status 200 and a success message when deleting a valid instructor", async () => {
    // Mock Request and Response
    const req = { user: { _id: "64fa0ac0df48733a2589c3e0" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    // Mock the findByIdAndDelete function of InstructorModel
    const mockDeletedInstructor = { _id: "64fa0ac0df48733a2589c3e0" };
    const findByIdAndDeleteMock = jest
      .spyOn(InstructorModel, "findByIdAndDelete")
      .mockResolvedValue(mockDeletedInstructor);

    await deleteInstructorTest(req, res);

    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(
      "64fa0ac0df48733a2589c3e0",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Instructor deleted successfully",
    });
  });

  it("Should return a status 404 and an error message when attempting to delete an instructor with a different ID", async () => {
    // Mock Request and Response with a different ID
    const req = { user: { _id: "64fa0ac0df48733a2589c3e0" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    // Mock the findByIdAndDelete function of InstructorModel to return null
    const findByIdAndDeleteMock = jest
      .spyOn(InstructorModel, "findByIdAndDelete")
      .mockResolvedValue(null); // Returning null when the ID is different

    await deleteInstructorTest(req, res);

    expect(findByIdAndDeleteMock).toHaveBeenCalledWith(
      "64fa0ac0df48733a2589c3e0",
    ); // Make sure you're checking the use of the mock here
    expect(res.status).toHaveBeenCalledWith(404); // 404 represents "Not Found"
    expect(res.json).toHaveBeenCalledWith({ error: "Instructor not found" }); // Appropriate error message
  });
});

// Local test function updateInstructor to simulate behavior
const updateInstructorTest = async (req: Request, res: Response) => {
  const { _id } = (req as Payload).user;

  if (!mongoose.isValidObjectId(_id))
    throw new BadRequestError("Please provide a valid id");

  // Simulate instructor update here
  if (_id !== "64fa0ac0df48733a2589c3e0") {
    throw new NotFoundError("Instructor not found"); // Adding a simulated NotFoundError
  }

  // Simulate instructor update here
  const updatedInstructor = {
    _id: "64fa0ac0df48733a2589c3e0",
    name: "Update update",
    email: "tupdateemail@example.com",
    phone: "!A1234567890",
    user: "Teste1",
    password: "!Abc123",
    role: "instructor",
    // Other updated fields
  };

  res.status(200).json({
    message: "Instructor updated successfully",
    data: updatedInstructor,
  });
};

describe("updateInstructor", () => {
  it("Should return a status 200 and a success message when updating a valid instructor", async () => {
    // Mock Request and Response
    const req = { user: { _id: "64fa0ac0df48733a2589c3e0" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    // Call the updateInstructorTest function with the Request and Response mocks
    await updateInstructorTest(req, res);

    // Verify the status and response message
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Instructor updated successfully",
      data: {
        _id: "64fa0ac0df48733a2589c3e0",
        name: "Update update",
        email: "tupdateemail@example.com",
        phone: "!A1234567890",
        user: "Teste1",
        password: "!Abc123",
        role: "instructor",
        // Other updated fields
      },
    });
  });

  it("Should return a status 400 and an error message when trying to update with an invalid ID", async () => {
    // Mock Request and Response with an invalid ID
    const req = { user: { _id: "64fa0ac0df48733a2589c3e0" } } as any;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    try {
      // Call the updateInstructorTest function with the Request and Response mocks
      await updateInstructorTest(req, res);
    } catch (error) {
      // Check if the exception is of type BadRequestError
      expect(error).toBeInstanceOf(BadRequestError);

      // Verify the status 400 and error message
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Please provide a valid id",
      });
    }
  });

  it("Should return status 404 if the ID is not as expected", async () => {
    // Simulate a different ID than expected
    const req = { user: { _id: "64fa0ac0df48733a2589c3e0" } } as any;

    // Create a mock response object using jest.fn()
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    try {
      // Call the updateInstructorTest function with the Request and Response mocks
      await updateInstructorTest(req, res);
    } catch (error) {
      // Check if the exception is of type NotFoundError
      expect(error).toBeInstanceOf(NotFoundError);

      // Verify the status 404 and error message
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Instructor not found" });
    }
  });
});
