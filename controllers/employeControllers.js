const pool = require("../config/db");

exports.getEmployees = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees order by id desc");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ambil data dari employees" });
  }
};

// Tambah user
exports.addEmployees = async (req, res) => {
    const { name, email, phone, position } = req.body || {};

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
      "insert into employees (name, email, phone, position) values ($1,$2,$3,$4) returning *",
      [name, email, phone, position]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === "23505") {
      return res.status(400).json({ message: "Email sudah dipakai" });
    }
  
    res.status(500).json({ message: "Error insert data employees" });
  }
};

// Delete user
exports.deleteEmployees =  async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      "delete from employees where id = $1 returning *",
      [id]
    );

    // ⚠️ kalau user tidak ditemukan
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Data Employee tidak ditemukan",
      });
    }

    res.json({
      message: "Data Employee berhasil dihapus",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error delete data employee",
    });
  }
};

//Update user
exports.updateEmployees = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, position } = req.body;

  try {
    const result = await pool.query(
      "UPDATE employees SET name = $1, email = $2, phone = $3, position = $4 WHERE id = $5 RETURNING *",
      [ name, email, phone, position, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Employee tidak ditemukan untuk update",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error update employee",
    });
  }
};