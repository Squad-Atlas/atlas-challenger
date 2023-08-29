import { Instructor } from "../models/instructor";

export interface ValidationErrors {
  msgErrors: string;
}

export function validateFields(data: Instructor): ValidationErrors {
  const errors: ValidationErrors = { msgErrors: "" };

  if (!data.name || data.name.trim() === "") {
    const error: string = "[The name is required.] ";
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    const error: string = "[The e-mail is invalid.] ";
    errors.msgErrors = errors.msgErrors.concat(error);
  }

  if (!data.phone || data.phone.length < 10) {
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
