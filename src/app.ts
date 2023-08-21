import * as express from "express"
import { Request, Response } from "express"

const app = express()

// JSON
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!")
})

export default app
