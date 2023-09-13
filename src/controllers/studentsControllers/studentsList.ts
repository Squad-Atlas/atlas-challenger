import ClassroomModel from '@/models/classroom';
import { Request, Response } from 'express';

export const registerList = async (req: Request, res: Response) => {
  try {
    const listSubjects = await ClassroomModel.find({
        students: req.params.id
    },
    {
        _id: 0,
        students: 0
    },  

    )
    return res.status(200).json(listSubjects);
    
  } catch (error) {
    return res.sendStatus(500)
  }
}

