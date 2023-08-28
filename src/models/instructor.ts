import mongoose, { Document, Schema, Types } from "mongoose";

export interface Instructor extends Document {
  name: string;
  email: string;
  students: Types.ObjectId[];
  phone: string;
  user: string;
  password: string;
  role: string;
  specialty: string[];
}

const InstructorSchema = new Schema<Instructor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student", default: [] }],
    phone: { type: String, required: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    specialty: [{ type: String }],
  },
  { timestamps: true },
);

const InstructorModel = mongoose.model<Instructor>(
  "Instructor",
  InstructorSchema,
);

export default InstructorModel;
