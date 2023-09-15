/**
 * @swagger
 * components:
 *  schemas:
 *      Student:
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
 *                  format: email
 *                  example: "Diego@email.com"
 *              phone:
 *                  type: string
 *                  example: "1140028922"
 *              user:
 *                  type: string
 *                  example: "Diego"
 *              password:
 *                  type: string
 *                  format: password
 *                  example: "Password@123"
 *
 *      StudentResponse:
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
 *                  example: "$2b$10$tsLZtUdyWwNRp9FdxVPNbO1PB5m2gHXGzWWBIxGtLKJnK8SPRIjTC"
 *              role:
 *                  type: string
 *                  default: "student"
 *              classroom:
 *                  type: string
 *                  default: []
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
 *      ListStudents:
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
 */
