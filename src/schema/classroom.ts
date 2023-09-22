/**
 * @swagger
 * components:
 *  schemas:
 *      ListSubjects:
 *          type: object
 *          properties:
 *              _id:
 *                  type: string
 *                  example: "64fb20d1e70f4dbd6bac3db0"
 *              subject:
 *                  type: string
 *                  example: "Math"
 *              instructor:
 *                  type: object
 *                  properties:
 *                      _id:
 *                          type: string
 *                          example: "64fb209ffdd0e45d08cbf1e2"
 *                      name:
 *                          type: string
 *                          example: "Douglas"
 *              schedule:
 *                  type: object
 *                  properties:
 *                      day:
 *                          type: string
 *                          example: "Monday"
 *                      startTime:
 *                          type: string
 *                          example: "09:50:00"
 *                      endTime:
 *                          type: string
 *                          example: "10:40:00"
 */
