import nodemailer from "nodemailer";
import { config } from "@/config/config";
import { Student } from "@/models/student";
import { Classroom } from "@/models/classroom";

const transporter = nodemailer.createTransport({
  host: config.sendMail.host,
  port: config.sendMail.port,
  secure: false,
  auth: {
    user: config.sendMail.username,
    pass: config.sendMail.password,
  },
});

export async function sendMailSubscription(
  student: Student,
  classroom: Classroom,
  day: string,
  startTime: string,
  endTime: string,
) {
  try {
    const htmlContent = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Registration Confirmation</title>
    </head>
    <body>
        <p>Congratulations ${student.name},</p>
        
        <p>You have been successfully registered in the ${classroom.subject} class with instructor ${classroom.instructor.name}!</p>
        
        <p>Schedule: ${day}, from ${startTime} to ${endTime}.</p>
        
        <p>Follow this link to access the <a href="${classroom.linkClassroom}">classroom</a>.</p>
        
        <p>Best regards,</p>
        <p>Atlas School</p>
    </body>
    </html>`;

    await transporter.sendMail({
      from: "AtlasSchool@example.com",
      to: student.email,
      subject: classroom.subject,
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
  }
}
