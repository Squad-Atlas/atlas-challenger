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
 *              specialty:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: ["Math", "Portuguese"]
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
 *              students:
 *                  type: array
 *                  default: []
 *              phone:
 *                  type: string
 *                  example: "1140028922"
 *              user:
 *                  type: string
 *                  example: "Diego"
 *              password:
 *                  type: string
 *                  example: "$2b$10$Dsub3fdFP81yFf.PRIVCOOh2LqjuZf0my82ijccMHSwnRm92wUvXe"
 *              specialty:
 *                  type: array
 *                  items:
 *                      type: string
 *                  example: ["Math", "Portuguese"]
 *              role:
 *                  type: string
 *                  default: "admin"
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
 */
