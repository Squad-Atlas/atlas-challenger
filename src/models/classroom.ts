import mongoose, { Document, Schema } from "mongoose";
import { Instructor } from "./instructor";
import { Student } from "./student";
import { StudentsFiles } from "./studentsFile";

export interface Classroom extends Document {
  subject: string;
  instructor: Instructor;
  schedule: Schedule[];
  students: Student[];
  documents: StudentsFiles[];
  linkClassroom: string;
}

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

const ClassroomSchema = new Schema<Classroom>(
  {
    subject: { type: String, required: true, unique: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    schedule: [
      {
        _id: false,
        day: { type: String },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
    students: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: [] },
    ],
    documents: [
      {
        _id: false,
        authorId: { type: String },
        fileName: { type: String },
        filePath: { type: String },
        fileObject: { type: Object },
        default: [],
      },
    ],
    linkClassroom: { type: String, required: true },
  },
  { timestamps: true },
);

const ClassroomModel = mongoose.model<Classroom>("Classroom", ClassroomSchema);

export default ClassroomModel;
