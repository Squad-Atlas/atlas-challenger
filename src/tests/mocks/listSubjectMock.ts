import { Types } from "mongoose";

const listSubjectMock = async (
  studentId: string,
  filter: string,
): Promise<string[]> => {
  const studentId1 = new Types.ObjectId("5f7f91c74d3e1746f093da1c");
  const studentId2 = new Types.ObjectId("5f7f91c74d3e1746f093da2b");

  const subjectArray1 = ["Math", "Physics", "Chemistry"];
  const subjectArray2 = ["History", "Geography", "English"];

  if (studentId === studentId1.toHexString() && !filter) {
    return subjectArray1;
  }

  if (studentId === studentId2.toHexString() && !filter) {
    return subjectArray2;
  }

  if (studentId === studentId1.toHexString() && filter) {
    const subject = subjectArray1.find((sub: string) =>
      sub.toLowerCase().includes(filter.toLowerCase()),
    );

    if (subject) {
      return [subject];
    }

    return [];
  }

  if (studentId === studentId2.toHexString() && filter) {
    const subject = subjectArray2.find((sub: string) => sub.includes(filter));

    if (subject) {
      return [subject];
    }

    return [];
  }

  return [];
};

export default listSubjectMock;
