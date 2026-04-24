const app = require("./app");
const pool = require("./config/db");


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



app.listen(3001, () => {
  console.log("Server running on port 3001");
});