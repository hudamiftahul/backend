const pool = require("../config/db");
const bcrypt = require("bcrypt");

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password, employee_id } = req.body;

  if (!username || !email || !password || !employee_id) {
    return res.status(400).json({ message: "Wajib diisi" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password, employee_id) VALUES ($1,$2,$3,$4) RETURNING *",
      [username, email, hashed, employee_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Data sudah digunakan" });
    }

    res.status(500).json({ message: "Error register" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: "User tidak ditemukan" });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Password salah" });
  }

  res.json({
    message: "Login berhasil",
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
};