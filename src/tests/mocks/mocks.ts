import { StudentsFiles } from "@/models/studentsFile";
import { ObjectId } from "mongodb";

const scheduleMock = [
  { day: "Segunda", time: "9:00" },
  { day: "Quarta", time: "11:00" },
];

const studentMock1 = {
  _id: "student1",
  name: "Aluno 1",
};

const studentMock2 = {
  _id: "student2",
  name: "Aluno 2",
};

const studentsMock = [studentMock1, studentMock2];

const documentMock1 = {
  _id: "document1",
  title: "Documento 1",
};

const documentMock2 = {
  _id: "document2",
  title: "Documento 2",
};

const documentsMock = [documentMock1, documentMock2];

const classroomMock = {
  subject: "Matemática",
  instructor: {
    _id: "123",
    name: "João Silva",
    email: "instructor@example.com",
    phone: "1234567890",
    user: "joao_silva",
    password: "password123",
    role: "Instructor",
  },
  schedule: scheduleMock,
  students: studentsMock,
  documents: documentsMock,
  linkClassroom: "https://example.com/classroom",
};

const instructorMock = classroomMock.instructor;

const reqFilesMock = {
  name: "Roll With The Punchs.txt",
  data: {},
  size: 20,
  encoding: "7bit",
  tempFilePath: "",
  truncated: false,
  mimetype: "text/plain",
  md5: "bbb6cc004fea60e875f94538f32fd8c4",
};

const reqFilesInvalidMock = {
  name: "Roll With The Punchs.ppt",
  data: {},
  size: 20,
  encoding: "7bit",
  tempFilePath: "",
  truncated: false,
  mimetype: "text/plain",
  md5: "bbb6cc004fea60e875f94538f32fd8c4",
};

const objectToReferenceFileMock: StudentsFiles = {
  authorId: "64fac262d28921562f268ed6",
  fileName: "Roll With The Punchs.txt",
  filePath: "./../../temp/Roll With The Punchs.txt",
};

const validStudentId = new ObjectId("64fac262d28921562f268ed6");
const validClassId = new ObjectId("64fac262d28921562f268021");
const invalidStudentId = "O id deve ser um ObjectID";
const invalidClassId = "O id deve ser um ObjectID";

export {
  instructorMock,
  classroomMock,
  scheduleMock,
  studentsMock,
  documentsMock,
  reqFilesMock,
  reqFilesInvalidMock,
  objectToReferenceFileMock,
  validStudentId,
  validClassId,
  invalidStudentId,
  invalidClassId,
};
