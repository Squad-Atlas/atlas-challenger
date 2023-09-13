/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiError } from "@/helpers/api-errors";
import { errorMiddleware } from "@/middlewares/error";
import { Request, Response } from "express"; // Certifique-se de importar os tipos corretos
describe("middlewareError", () => {
  // Tests that the function returns a response with the correct status code and message when given an error object with a statusCode property and a message property
  it("should return response with correct status code and message when given error object with statusCode and message properties", () => {
    // Arrange
    const error = new ApiError("Test Error", 400);
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    // Act
    errorMiddleware(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Test Error" });
    expect(next).not.toHaveBeenCalled();
  });

  // Tests that the function returns a response with a default status code and message when given an error object without a statusCode property
  it("should return response with default status code and message when given error object without statusCode property", () => {
    // Arrange
    const error = new Error("Test Error");
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    // Act
    errorMiddleware(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    expect(next).not.toHaveBeenCalled();
  });
});
