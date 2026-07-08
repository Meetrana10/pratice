const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ---- Database Setup ----
// Create a connection pool (better than a single connection for a server)
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                mobile VARCHAR(20) NOT NULL,
                panels INT NOT NULL,
                amount INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ bookings table ready");
    } catch (err) {
        console.error("❌ Error creating table:", err);
    }
})();

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to Railway MySQL");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

// ---- Routes ----

// Create a new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, mobile, panels, amount } = req.body;

    if (!name || !mobile || !panels || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO bookings (name, mobile, panels, amount) VALUES (?, ?, ?, ?)",
      [name, mobile, panels, amount],
    );

    res.status(201).json({
      message: "Booking saved successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all bookings (useful for testing/admin view)
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a booking by ID (useful for testing/admin view)
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM bookings WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
