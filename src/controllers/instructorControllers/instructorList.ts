import ClassroomModel from "@/models/classroom";
import { Request, Response } from "express";

export const getList = async (req: Request, res: Response) => {
    try {
        const getListInstructor = await ClassroomModel.findById({
            instructors: req.params.id
        })
        return res.status(200).json(getListInstructor);

    } catch (error) {
        return res.sendStatus(500);
    }
}

export const updateList = async (req: Request, res: Response) => {
    try {
        const updateListInstructor = await ClassroomModel.findByIdAndUpdate({
            instructors: req.params.id,
        });
        return res.status(200).json(updateListInstructor);
    } catch (error) {
        return res.sendStatus(500);
    }
}


export const deleteList = async (req: Request, res: Response) => {
    try {
        const deleteListInstructor = await ClassroomModel.findByIdAndDelete({
            instructor: req.params.id
        })
        return res.status(200).json(deleteListInstructor);
    } catch (error) {
        return res.sendStatus(500);
    }
}