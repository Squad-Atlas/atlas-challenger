/* eslint-disable @typescript-eslint/no-explicit-any */
const validateScheduleConflict = (
  instructor: any,
  classroom: any,
): string[] => {
  const conflictingClasses: string[] = [];

  for (const instructorSchedule of instructor.schedule) {
    const conflict = classroom.schedule.find(
      (classroomSchedule: any) =>
        classroomSchedule.day === instructorSchedule.day &&
        classroomSchedule.time === instructorSchedule.time,
    );

    if (conflict) {
      conflictingClasses.push(
        `${classroom.subject} at ${conflict.day} ${conflict.time}`,
      );
    }
  }

  return conflictingClasses;
};

export default validateScheduleConflict;
