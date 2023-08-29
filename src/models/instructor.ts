import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

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

InstructorSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

InstructorSchema.methods.comparePassword = async function (
  reqPassword: string,
) {
  const isMatch = await bcrypt.compare(reqPassword, this.password);
  return isMatch;
};

const InstructorModel = mongoose.model<Instructor>(
  "Instructor",
  InstructorSchema,
);

export default InstructorModel;
