import { Types } from "mongoose";

const listSubjectMock = async (studentId: string): Promise<string[]> => {
  const studentId1 = new Types.ObjectId("5f7f91c74d3e1746f093da1c");
  const studentId2 = new Types.ObjectId("5f7f91c74d3e1746f093da2b");

  if (studentId === studentId1.toHexString()) {
    return ["Math", "Physics", "Chemistry"];
  }

  if (studentId === studentId2.toHexString()) {
    return ["History", "Geography", "English"];
  }

  return [];
};

export default listSubjectMock;
