import app from "./app";
import { config } from "./config/config";
import "./database/database";

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`👂 Server is listening on http://localhost:${PORT} `);
});
