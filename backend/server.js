const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();     

app.use(cors());            
app.use(express.json());    

const PORT = process.env.PORT || 8080;

// ===== LRU CACHE =====
const capacity = 5;
let cache = new Map();
let hits = 0;
let misses = 0;

// ===== DATABASE =====
const db = new sqlite3.Database("cache.db");

db.run("CREATE TABLE IF NOT EXISTS fruits (id INTEGER PRIMARY KEY, value TEXT)");

// ===== GET =====
app.get("/get", (req, res) => {
    const key = parseInt(req.query.key);

    if (cache.has(key)) {
        hits++;
        let value = cache.get(key);

        cache.delete(key);
        cache.set(key, value);

        return res.json({
            result: value,
            hitRate: (hits / (hits + misses)) * 100 || 0,
            hits,
            misses
        });
    }

    misses++;

    db.get("SELECT value FROM fruits WHERE id=?", [key], (err, row) => {
        if (!row) {
            return res.json({ result: "Not found", hitRate: 0, hits, misses });
        }

        cache.set(key, row.value);

        if (cache.size > capacity) {
            let firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        res.json({
            result: row.value,
            hitRate: (hits / (hits + misses)) * 100,
            hits,
            misses
        });
    });
});

// ===== ADD =====
app.get("/add", (req, res) => {
    const value = req.query.value;

    db.run("INSERT INTO fruits(value) VALUES(?)", [value]);

    res.send("Added");
});

// ===== DELETE =====
app.get("/delete", (req, res) => {
    const id = req.query.id;

    db.run("DELETE FROM fruits WHERE id=?", [id]);

    cache.delete(parseInt(id));

    res.send("Deleted");
});

// ===== UPDATE =====
app.get("/update", (req, res) => {
    const id = req.query.id;
    const value = req.query.value;

    db.run("UPDATE fruits SET value=? WHERE id=?", [value, id]);

    cache.set(parseInt(id), value);

    res.send("Updated");
});

// ===== KEYS =====
app.get("/keys", (req, res) => {
    db.all("SELECT * FROM fruits", [], (err, rows) => {
        res.json(rows);
    });
});

// ===== CLEAR CACHE =====
app.get("/clear", (req, res) => {
    cache.clear();
    hits = 0;
    misses = 0;
    res.send("Cache cleared");
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});