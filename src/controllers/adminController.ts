import { Request, Response } from "express";
import AdminModel, { Admin } from "@/models/admin";
import "express-async-errors";


export const getAdmin = async (req: Request,  res: Response) => {
    const Admin: Admin[] = await AdminModel.find();
    res.status(200).json(Admin);
}