import moment from "moment";

export interface IconflictTime {
  startTime: string;
  endTime: string;
}

export function conflictTime(
  startTime: string,
  endTime: string,
  times: IconflictTime[],
): boolean {
  const momentStartTime = moment(startTime, "HH:mm:ss");
  const momentEndTime = moment(endTime, "HH:mm:ss");

  for (const time of times) {
    const momentObjectStartTime = moment(time.startTime, "HH:mm:ss");
    const momentObjectEndTime = moment(time.endTime, "HH:mm:ss");
    if (
      momentObjectStartTime.isSame(momentStartTime) ||
      momentObjectEndTime.isSame(momentStartTime) ||
      momentObjectStartTime.isBetween(momentStartTime, momentEndTime) ||
      momentObjectEndTime.isBetween(momentStartTime, momentEndTime)
    )
      return true;
  }

  return false;
}
