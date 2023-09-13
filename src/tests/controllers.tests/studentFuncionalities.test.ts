import listSubjectMock from "../mocks/listSubjectMock";

describe("validateStudentEnrollment", () => {
  it("should return classes for the student with the corresponding studentId", async () => {
    const studentId = "5f7f91c74d3e1746f093da1c";
    const classes = await listSubjectMock(studentId);
    expect(classes).toEqual(["Math", "Physics", "Chemistry"]);
  });

  it("should return different classes for another student with the corresponding studentId", async () => {
    const studentId = "5f7f91c74d3e1746f093da2b";
    const classes = await listSubjectMock(studentId);
    expect(classes).toEqual(["History", "Geography", "English"]);
  });

  it("should return an empty array for an unregistered student", async () => {
    const studentId = "unregisteredStudent";

    const classes = await listSubjectMock(studentId);

    expect(classes).toEqual([]);
  });
});

import validateScheduleConflict from "@/tests/mocks/validateScheduleConflict";

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
