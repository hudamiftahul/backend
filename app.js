const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

// 🔥 route utama
app.use("/users", userRoutes);

app.use("/employees", employeeRoutes);
app.use("/auth", authRoutes);

module.exports = app;