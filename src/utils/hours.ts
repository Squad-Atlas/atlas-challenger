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
      momentObjectStartTime.isSame(momentStartTime) || // Algum Inicial === Inicial da aula
      momentObjectEndTime.isSame(momentStartTime) || // Algum Final === Inicial da aula
      momentObjectStartTime.isBetween(momentStartTime, momentEndTime) || // Algum Inicial === Entiver entre o começo e final da aula
      momentObjectEndTime.isBetween(momentStartTime, momentEndTime) // Algum Final === Entiver entre o começo e final da aula
    )
      return true;
  }

  return false;
}

// Conflitos
// Outra aula Horario Inicial === Horario Inicial Ex: Aula começa 9:00 -> Aula começa 9:00
// Outra aula Horario Final === Horario Inicial Ex: Aula termina 9:50 -> Aula começa 9:50 ???
// Outra aula Horario Inicial === Estar entre Horario Inicial e Horario Final Ex: Aula começa 9:30 -> Aula marcada das 9:00 ás 9:50
// Outra aula Horario Final === Estar entre Horario Inicial e Horario Final Ex: Aula Termina 9:30 -> Aula marcada das 9:00 ás 9:50
