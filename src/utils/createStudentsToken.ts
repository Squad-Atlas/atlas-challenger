import jwt from 'jsonwebtoken';
import { Student }  from '@/models/student';
import { JWT_STUDENTS_SECRET } from '@/config/jwt';

export const header = new Headers()

export const createStudentsToken = (student: Student) => {
    const user = {
        name: student.name,
        email: student.name,
        userType: student.user,
    };

    const token = jwt.sign(user, JWT_STUDENTS_SECRET!, {
        algorithm: "HS256",
        expiresIn: 60,
    });
    header.append("token", "BearerInstructor " + token);
    console.log(token);
}

