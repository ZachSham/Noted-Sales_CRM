import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import clients from "./routes/clients.js";
import taskRouter from "./routes/task.js";
import meetingsRouter from "./routes/meetings.js";
import auth from "./routes/auth.js";
import aiRouter from "./routes/ai.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", auth);
app.use("/clients", clients);
app.use("/task", taskRouter);
app.use("/meetings", meetingsRouter);
app.use("/ai", aiRouter);

// Root route with helpful message
app.get('/', (req, res) => {
  res.send('Noted Sales CRM API is running. Try /auth, /clients, /task, /meetings, /ai endpoints.');
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});