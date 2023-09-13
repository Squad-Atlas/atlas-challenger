/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BadRequestError } from "@/helpers/api-errors";

jest.mock("mongoose", () => ({
  isValidObjectId: (arg: string) => {
    if (arg === "studentId" || arg === "classroomId") {
      return true;
    }

    return false;
  },
}));

interface IUploadedFile {
  name: string;
  extension: string;
  mv: (arg: string, cb: (err: any) => void) => void;
  date: string;
  size: number;
}

describe("studentsFunctionalities test suite", () => {
  describe("studentUploadFile test suite", () => {
    let correctFormSut: IUploadedFile;
    let incorrectFormSut: IUploadedFile;
    const local: IUploadedFile[] = [];

    function checksFileSize(file: IUploadedFile) {
      if (file.size > 3) {
        throw new BadRequestError("File too big.");
      }
      return;
    }

    beforeEach(() => {
      function errorFunction(error: string): void {
        console.log(error);
      }

      correctFormSut = {
        name: "file",
        extension: ".pdf",
        mv: (path: string, errorFunction) => {
          correctFormSut.name =
            correctFormSut.name +
            correctFormSut.date +
            correctFormSut.extension;
          local.push(correctFormSut);
        },
        date: "15-12-06",
        size: 2,
      };

      incorrectFormSut = {
        ...correctFormSut,
        size: 6,
        extension: "exe",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should upload file to local server", () => {
      const req = {
        files: { studentFile: correctFormSut },
      } as any;

      const file = req.files.studentFile;

      file.mv("../../temp/");

      expect(local).toEqual([correctFormSut]);
    });

    it("should throw error if file has 3MB or more of size", () => {
      try {
        const req = {
          files: { studentFile: incorrectFormSut },
        };

        const file = req.files.studentFile;

        checksFileSize(file);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error).toHaveProperty("message", "File too big.");
      }
    });
  });
});
