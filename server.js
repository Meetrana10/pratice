const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ---- Database Setup ----
// Create a connection pool (better than a single connection for a server)
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",        // leave empty since XAMPP default has no password
    database: "solar_bookings",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
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
            [name, mobile, panels, amount]
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
            "SELECT * FROM bookings ORDER BY created_at DESC"
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