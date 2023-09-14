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

export {
  instructorMock,
  classroomMock,
  scheduleMock,
  studentsMock,
  documentsMock,
};
