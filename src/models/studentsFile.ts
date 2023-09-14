import mongoose, { Schema } from "mongoose";

export interface StudentsFiles {
  authorId: string;
  fileName: string;
  filePath: string;
}

const FileSchema = new Schema<StudentsFiles>(
  {
    authorId: { type: String, required: true },
    fileName: { type: String },
    filePath: { type: String, required: true },
  },
  { timestamps: true },
);

export const StudentFileModel = mongoose.model("File", FileSchema);
