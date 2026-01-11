const path = require("path"); 
const sqlite3 = require("sqlite3").verbose(); 

const dbFile = 
    process.env.NODE_ENV === "test" 
        ? "./db/test.sqlite" 
        : "./db/dev.sqlite"; 

const db = new sqlite3.Database(dbFile, (err) => { 
    if (err) { 
        console.error("Failed to open database", err.message); 
    } 
    if (process.env.NODE_ENV !== "test") { 
        console.log("Database opened at", dbFile); 
    }
});

if (process.env.NODE_ENV !== "test") {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            passwordHash TEXT NOT NULL,
            createdAt TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            pricePerNight INTEGER NOT NULL,
            ownerID INTEGER NOT NULL,
            createdAt TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (ownerID) REFERENCES users(id)
        )
    `);
}

module.exports = { db }; 