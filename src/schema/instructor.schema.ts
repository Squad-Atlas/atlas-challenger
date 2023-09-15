/**
 * @swagger
 * components:
 *  schemas:
 *      Instructor:
 *          type: object
 *          required:
 *              - name
 *              - email
 *              - phone
 *              - user
 *              - password
 *          properties:
 *              name:
 *                  type: string
 *                  example: "Diego"
 *              email:
 *                  type: string
 *                  example: "Diego@email.com"
 *              phone:
 *                  type: string
 *                  example: "1140028922"
 *              user:
 *                  type: string
 *                  example: "Diego"
 *              password:
 *                  type: string
 *                  example: "Password@123"
 *
 *      InstructorResponse:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: 64ecdbfeb0346a88964bcc55
 *              name:
 *                  type: string
 *                  example: "Diego"
 *              email:
 *                  type: string
 *                  example: "Diego@email.com"
 *              phone:
 *                  type: string
 *                  example: "1140028922"
 *              user:
 *                  type: string
 *                  example: "Diego"
 *              password:
 *                  type: string
 *                  example: "$2b$10$Dsub3fdFP81yFf.PRIVCOOh2LqjuZf0my82ijccMHSwnRm92wUvXe"
 *              role:
 *                  type: string
 *                  default: "instructor"
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  example: 2023-08-28T17:40:14.764Z
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  example: 2023-08-28T17:40:14.764Z
 *              __v:
 *                  type: integer
 *                  example: 0
 *
 *      InstructorClass:
 *          type: object
 *          required:
 *              - subject
 *              - schedule
 *              - linkClassroom
 *          properties:
 *              subject:
 *                  type: string
 *                  example: "Math"
 *              schedule:
 *                  type: object
 *                  properties:
 *                      day:
 *                          type: string
 *                          example: "Monday"
 *                      startTime:
 *                          type: string
 *                          example: "09:30:00"
 *                      endTime:
 *                          type: string
 *                          example: "10:20:00"
 *              linkClassroom:
 *                  type: string
 *                  example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 */
