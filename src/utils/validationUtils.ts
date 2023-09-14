/*eslint-disable @typescript-eslint/no-explicit-any */

import { Student } from "@/models/student";
import { Instructor } from "../models/instructor";
import InstructorModel from "@/models/instructor";
import StudentModel from "@/models/student";
import { Request } from "express";

export interface ValidationErrors {
  msgErrors: string;
}

export function validateFields(data: Instructor | Student): ValidationErrors {
  const errors: ValidationErrors = { msgErrors: "" };

  if (
    !data.name ||
    !/^[A-Za-z\s]+$/.test(data.name) ||
    data.name.length < 3 ||
    data.name.length > 50
  ) {
    const error: string = `[The name must contain only letters and spaces, and be between ${3} and ${50} characters.] `;
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    const error: string = "[The e-mail is invalid.] ";
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    const error: string = "[The phone is invalid.] ";
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  const USERNAME_REGEX = /^[a-zA-Z0-9]{4,30}$/;
  if (!data.user || !USERNAME_REGEX.test(data.user)) {
    const error: string = "[The username is invalid.] ";
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  const UPPERCASE_REGEX = /[A-Z]/;
  const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
  const NUMBER_REGEX = /[0-9]/;
  if (
    !data.password ||
    !UPPERCASE_REGEX.test(data.password) ||
    !SPECIAL_CHAR_REGEX.test(data.password) ||
    !NUMBER_REGEX.test(data.password)
  ) {
    const error: string =
      "[The password must contain at least one capital letter, one special character and one number.] ";
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  return errors;
}

export async function validateRepeatedUser(req: Request, table: string) {
  let repeatedEmailToSearch: any;
  let repeatedPhoneNumberToSearch: any;
  let repeatedUserToSearch: any;

  if (table === "instructor") {
    repeatedEmailToSearch = await InstructorModel.find({
      email: req.body.email,
    });
    repeatedUserToSearch = await InstructorModel.find({ user: req.body.user });
    repeatedPhoneNumberToSearch = await InstructorModel.find({
      phone: req.body.phone,
    });

    if (
      repeatedEmailToSearch.length > 0 ||
      repeatedUserToSearch.length > 0 ||
      repeatedPhoneNumberToSearch.length > 0
    ) {
      return true;
    }
  }

  if (table === "student") {
    repeatedEmailToSearch = await StudentModel.find({ email: req.body.email });
    repeatedUserToSearch = await StudentModel.find({ user: req.body.user });
    repeatedPhoneNumberToSearch = await StudentModel.find({
      phone: req.body.phone,
    });

    if (
      repeatedEmailToSearch.length > 0 ||
      repeatedUserToSearch.length > 0 ||
      repeatedPhoneNumberToSearch.length > 0
    ) {
      return true;
    }
  }

  return false;
}
