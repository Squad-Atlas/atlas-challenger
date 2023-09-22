import mongoose, { Document, Schema} from "mongoose";

export interface Admin extends Document {
    user: string;
    password: string;
    role: string;
}

const AdminSchema = new Schema<Admin>({
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    role: { type: String, default: 'admin'},
})

const AdminModel = mongoose.model<Admin>(
    'Admin',
    AdminSchema,
)

export default AdminModel;