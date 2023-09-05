import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Classroom } from "./classroom";

export interface Student extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  user: string;
  password: string;
  role: string;
  classroom: Classroom[];

  comparePassword(reqPassword: string): boolean;
}

const StudentSchema = new Schema<Student>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    classroom: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
  },
  { timestamps: true },
);

StudentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

StudentSchema.methods.comparePassword = async function (reqPassword: string) {
  const isMatch = await bcrypt.compare(reqPassword, this.password);
  return isMatch;
};

const StudentModel = mongoose.model<Student>("Student", StudentSchema);

export default StudentModel;
