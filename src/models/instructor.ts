import mongoose, { Document, Schema, Types } from "mongoose";

interface Instructor extends Document {
  name: string;
  email: string;
  students: Types.ObjectId[];
  phone: string;
  user: string;
  password: string;
  role: string;
  specialties: string[];
}

const InstructorSchema = new Schema<Instructor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student", required: true }],
  phone: { type: String, required: true },
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String },
  specialties: [{ type: String }],
});

const InstructorModel = mongoose.model<Instructor>(
  "Instructor",
  InstructorSchema,
);

export default InstructorModel;
