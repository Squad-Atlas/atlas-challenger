import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  _id: string;
  user: string;
  password: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>({
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

const AdminModel = mongoose.model<IAdmin>("Admin", AdminSchema);

export default AdminModel;
