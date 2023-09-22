import listSubjectMock from "../mocks/listSubjectMock";

import { BadRequestError } from "@/helpers/api-errors";
import {
  IUploadedFile,
  MockReqFiles,
  checksFileSize,
  createFileName,
} from "../mocks/fileUpload";

describe("validateStudentEnrollment", () => {
  it("should return classes for the student with the corresponding studentId", async () => {
    const studentId = "5f7f91c74d3e1746f093da1c";
    const classes = await listSubjectMock(studentId, "");
    expect(classes).toEqual(["Math", "Physics", "Chemistry"]);
  });

  it("should return different classes for another student with the corresponding studentId", async () => {
    const studentId = "5f7f91c74d3e1746f093da2b";
    const classes = await listSubjectMock(studentId, "");
    expect(classes).toEqual(["History", "Geography", "English"]);
  });

  it("should return an empty array for an unregistered student", async () => {
    const studentId = "unregisteredStudent";
    const classes = await listSubjectMock(studentId, "");
    expect(classes).toEqual([]);
  });

  it("should return filtered subject when filter is given", async () => {
    const studentId = "5f7f91c74d3e1746f093da1c";
    const classes = await listSubjectMock(studentId, "ath");
    expect(classes).toEqual(["Math"]);
  });

  it("should return an empty array for a not listed subject", async () => {
    const studentId = "5f7f91c74d3e1746f093da2b";
    const classes = await listSubjectMock(studentId, "Prog");
    expect(classes).toEqual([]);
  });
});

import validateScheduleConflict from "@/tests/mocks/validateScheduleConflict";
import { StudentsFiles } from "@/models/studentsFile";
import { ObjectId } from "mongodb";
import {
  invalidClassId,
  invalidStudentId,
  objectToReferenceFileMock,
  reqFilesInvalidMock,
  reqFilesMock,
  validClassId,
  validStudentId,
} from "../mocks/mocks";

describe("validateScheduleConflict", () => {
  it("should return an empty array when there are no schedule conflicts", () => {
    const instructor = {
      schedule: [
        { day: "Monday", time: "9:00" },
        { day: "Wednesday", time: "11:00" },
      ],
    };

    const classroom = {
      subject: "Math",
      schedule: [
        { day: "Tuesday", time: "10:00" },
        { day: "Thursday", time: "13:00" },
      ],
    };

    const conflicts = validateScheduleConflict(instructor, classroom);

    expect(conflicts).toEqual([]);
  });

  it("should return descriptions of schedule conflicts when conflicts exist", () => {
    const instructor = {
      schedule: [
        { day: "Monday", time: "9:00" },
        { day: "Wednesday", time: "11:00" },
      ],
    };

    const classroom = {
      subject: "Math",
      schedule: [
        { day: "Wednesday", time: "11:00" },
        { day: "Friday", time: "9:00" },
      ],
    };

    const conflicts = validateScheduleConflict(instructor, classroom);

    expect(conflicts).toEqual(["Math at Wednesday 11:00"]);
  });

  it("should return an empty array when there are no schedules defined for instructor and classroom", () => {
    const instructor = {
      schedule: [],
    };

    const classroom = {
      subject: "Math",
      schedule: [],
    };

    const conflicts = validateScheduleConflict(instructor, classroom);

    expect(conflicts).toEqual([]);
  });
});

describe("studentUploadFile test suite", () => {
  let correctFormSut: IUploadedFile;
  let incorrectFormSut: IUploadedFile;
  const local: IUploadedFile[] = [];

  beforeEach(() => {
    correctFormSut = {
      name: "file",
      extension: ".pdf",
      mv: () => {
        correctFormSut.name = createFileName(correctFormSut);
        local.push(correctFormSut);
      },
      size: 2,
    };

    incorrectFormSut = {
      ...correctFormSut,
      size: 6,
      extension: ".exe",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should upload file to local server", () => {
    const req = {
      files: { studentFile: correctFormSut },
    };

    const file = req.files!.studentFile;

    file.mv("../../temp/", (err: Error) => console.log(err));

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

  it("should create files with different names", () => {
    const req1 = {
      files: { studentFile: { ...correctFormSut } },
    };

    const file1 = req1.files.studentFile;

    file1.mv("../../temp", (err: Error) => console.log(err));

    const req2 = { files: { studentFile: { ...correctFormSut } } };

    const file2 = req2.files.studentFile;

    file2.mv("../../temp", (err: Error) => console.log(err));

    expect(file1.name).not.toMatch(file2.name);
  });
});

describe("studentUploadFile test suite 2", () => {
  const classFilesReference: StudentsFiles[] = [];

  const mockUploadObjectReferenceToFileToDB = jest.fn(
    (StudentFile: StudentsFiles) => classFilesReference.push(StudentFile),
  );

  const mockValidateParams = jest.fn(
    (StudentId, ClassId) =>
      StudentId instanceof ObjectId && ClassId instanceof ObjectId,
  );

  const mockValidateFileType = jest.fn((mockReqFile: MockReqFiles): boolean => {
    if (
      mockReqFile.name.endsWith("txt") ||
      mockReqFile.name.endsWith("pdf") ||
      mockReqFile.name.endsWith("docx")
    ) {
      return true;
    }
    return false;
  });

  describe("Upload File", () => {
    const req = {
      files: reqFilesMock,
      params: { validStudentId, validClassId },
    };

    it("should return true if the params are valid", () => {
      expect(
        mockValidateParams(req.params.validStudentId, req.params.validClassId),
      ).toBe(true);
    });

    it("should return true for valid files (txt, pdf, docx)", () => {
      expect(mockValidateFileType(req.files)).toBe(true);
    });

    it("should return a new object to reference the file in the server", () => {
      const objectToReferenceFileMockTest: StudentsFiles = {
        authorId: `${req.params.validStudentId}`,
        fileName: req.files.name,
        filePath: "./../../temp/" + `${req.files.name}`,
      };
      expect(objectToReferenceFileMockTest).toEqual(objectToReferenceFileMock);
    });

    it("should move file to DB (local array)", () => {
      const initialDBLength = classFilesReference.length;
      mockUploadObjectReferenceToFileToDB(objectToReferenceFileMock);
      const finalDBLength = classFilesReference.length;
      expect(finalDBLength).toBeGreaterThan(initialDBLength);
    });
  });

  describe("Failed cases", () => {
    const req = {
      files: reqFilesInvalidMock,
      params: { invalidStudentId, invalidClassId },
    };

    it("should return error messages for invalid studentId or classId", () => {
      expect(mockValidateParams(invalidStudentId, invalidClassId)).toBe(false);
    });
    it("should return error messages for invalid format file", () => {
      expect(mockValidateFileType(req.files)).toBe(false);
    });
  });
});
