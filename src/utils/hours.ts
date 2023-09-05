import moment from "moment";

// Defina as duas horas de início e término do intervalo
export function conflictTime(
  startTime: string,
  endTime: string,
  times: string[],
): boolean {
  const momentStartTime = moment(startTime, "HH:mm:ss");
  const momentEndTime = moment(endTime, "HH:mm:ss");

  for (const time of times) {
    const momentTime = moment(time, "HH:mm:ss");
    if (momentTime.isBetween(momentStartTime, momentEndTime)) return true;
  }

  return false;
}

// const horaInicio = "08:00:00";
// const horaFim = "18:00:00";
// const horaVerificada = "12:30:00";

// console.log(conflictTime(horaInicio, horaFim, horaVerificada));
