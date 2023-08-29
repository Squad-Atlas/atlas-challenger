import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface Student extends Document {
  name: string;
  email: string;
  phone: string;
  user: string;
  password: string;
  instructor?: string;
  role: string;
  areasOfInterest: string[];
}

const studentSchema = new Schema<Student>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Instructor" },
    role: { type: String, default: "user" },
    areasOfInterest: [{ type: String }],
  },
  { timestamps: true },
);

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.comparePassword = async function (
  canditatePassword: string,
) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

const StudentModel = mongoose.model<Student>("Student", studentSchema);

export default StudentModel;
