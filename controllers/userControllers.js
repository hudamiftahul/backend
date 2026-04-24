const pool = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users order by id desc");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ambil data" });
  }
};

// Tambah user
exports.addUsers = async (req, res) => {
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
};

// Delete user
exports.deleteUsers =  async (req, res) => {
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
};

//Update user
exports.updateUsers = async (req, res) => {
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
};