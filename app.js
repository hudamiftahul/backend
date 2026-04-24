const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

// 🔥 route utama
app.use("/users", userRoutes);

module.exports = app;