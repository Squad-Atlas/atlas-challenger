import mongoose from "mongoose"
import app from "./app"
import { config } from "@/config/config"

// Connect To MongoDB
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("🎲 Connected to MongoDB Sucessfull!")
    const port = config.server.port || 3000
    app.listen(port, () => {
      console.log(`👂 Server is listening on http://localhost:${port} `)
    })
  })
  .catch((error) => {
    console.log(error)
  })
