const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

let users = [
  { id: 1, name: "Huda", email: "huda@mail.com" }
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
     
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            message: "Name dan email wajib diisi"
        });
    }

    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Email Salah"
        });
    }
   
    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);

    res.json({
        message: "User berhasil ditambahkan",
        data: newUser
    });
});

app.use(express.json());