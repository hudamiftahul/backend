const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();

app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "buantersby",
  port: 5432,
});

console.log("Testing DB connection...");

pool.connect()
  .then(client => {
    return client
      .query("SELECT NOW()")
      .then(res => {
        console.log("DB Connected:", res.rows);
        client.release();
      })
      .catch(err => {
        console.error("Query Error:", err);
        client.release();
      });
  })
  .catch(err => {
    console.error("Connection Error:", err);
  });

app.get("/", (req, res) => {
  res.send("API jalan 🚀");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// let users = [
//   { id: 1, name: "Huda", email: "huda@mail.com" }
// ];

// app.get("/users", (req, res) => {
//   res.json(users);
// });

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users order by id desc");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ambil data" });
  }
});

// app.post("/users", (req, res) => {
     
//     const { name, email } = req.body;
    
//     if (!name || !email) {
//         return res.status(400).json({
//             message: "Name dan email wajib diisi"
//         });
//     }

//     if (!email.includes("@")) {
//         return res.status(400).json({
//             message: "Email Salah"
//         });
//     }
   
//     const newUser = {
//         id: users.length + 1,
//         name,
//         email
//     };

//     users.push(newUser);

//     res.json({
//         message: "User berhasil ditambahkan",
//         data: newUser
//     });
// });

// Tambah user
app.post("/users", async (req, res) => {
    const { name, email } = req.body || {};

    if (!name || !email) {
        return res.status(400).json({ message: "Wajib diisi" });
    }
    
    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Email Salah"
        });
    }
   
  try {
    const result = await pool.query(
      "insert into users (name, email) values ($1,$2) returning *",
      [name, email]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error insert" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "delete from users where id = $1 returning *",
      [id]
    );

    // ⚠️ kalau user tidak ditemukan
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      message: "User berhasil dihapus",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error delete user",
    });
  }
});

//Update user
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error update user",
    });
  }
});