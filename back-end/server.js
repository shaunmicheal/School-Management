require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Rumbidzai ECD School API is live");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
