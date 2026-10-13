const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8001;
const cookieParser = require("cookie-parser");
const connectDB = require("./config/ConnectDB");

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", require("./routes/user.route.js"));
app.use("/projects", require("./routes/chat.route.js"));
app.use("/projects", require("./routes/project.route.js"));
app.use("/tasks", require("./routes/task.route.js"));
app.use("/", require("./routes/workspace.route.js"));

app.use((req, res) => res.status(404).json({ message: "Not found" }));

app.use((error, req, res, next) => {
  const status = error.status || (["ValidationError", "CastError"].includes(error.name) ? 400 : 500);
  if (status === 500) console.error(error);
  res.status(status).json({ message: status === 500 ? "Something went wrong" : error.message });
});

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("server started at" + port);
    });
  })
  .catch(() => {
    console.log("failed to connect to server");
  });
