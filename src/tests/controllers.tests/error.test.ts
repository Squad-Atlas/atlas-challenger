import { ApiError } from "@/helpers/api-errors";
import { errorMiddleware } from "@/middlewares/error";
import { Request, Response } from "express";
describe("middlewareError", () => {
  it("should return response with correct status code and message when given error object with statusCode and message properties", () => {
    const error = new ApiError("Test Error", 400);
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Test Error" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return response with default status code and message when given error object without statusCode property", () => {
    const error = new Error("Test Error");
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    expect(next).not.toHaveBeenCalled();
  });
});
