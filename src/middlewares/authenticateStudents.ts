import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_STUDENTS_SECRET } from 'config/jwt';
import { header } from '@/utils/createStudentsToken';

export const authenticateStudents = (
    req: Request,
    res: Response,
    next: NextFunction,
        
) => {  
    try {
        const studentsToken = header.get('token') || '';

        if(!studentsToken || !studentsToken.startsWith('BearerStudents')) {
            res.status(401).json({ error: 'Invalid token' });
            next();
        }
        
        const token = studentsToken.split(" ")[1];

        const tokenDecoded = jwt.verify(token, JWT_STUDENTS_SECRET!);

        console.log(tokenDecoded);
        next();
    } catch (error) {
        res.status(500).json({ error: 'Failed to authorize token'});
    }
};