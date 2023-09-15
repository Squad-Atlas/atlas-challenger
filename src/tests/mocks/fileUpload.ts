import { BadRequestError } from "@/helpers/api-errors";

export interface IUploadedFile {
  name: string;
  extension: string;
  mv: (arg: string, cb: (err: Error) => void) => void;
  size: number;
}

export interface MockReqFiles {
  name: string;
  data: object;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
}

export function checksFileSize(file: IUploadedFile) {
  if (file.size > 3) {
    throw new BadRequestError("File too big.");
  }
  return;
}

export function createFileName(file: IUploadedFile) {
  const actualTime = `${new Date().getHours().toString()}-${new Date()
    .getMinutes()
    .toString()}-${new Date().getSeconds().toString()}`;

  const newFileName = `${file.name}-${actualTime}${file.extension}`;

  return newFileName;
}

export function errorFunction(error: string): void {
  console.log(error);
}
