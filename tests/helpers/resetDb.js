const { db } = require("../../db/database"); 

function run(sql, params = []) { 
    return new Promise((resolve, reject) => { 
        db.run(sql, params, function (err) { 
            if (err) return reject(err); 
            resolve(this); 
        });
    });
}

async function resetDb() {
    await run (`DROP TABLE IF EXISTS rooms;`); 
    await run (`DROP TABLE IF EXISTS users`); 

    await run(`
        CREATE TABLE users ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            email TEXT UNIQUE NOT NULL, 
            passwordHash TEXT NOT NULL
        );     
    `);

    await run(`
        CREATE TABLE rooms ( 
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL, 
            pricePerNight REAL NOT NULL, 
            ownerID INTEGER NOT NULL, 
            FOREIGN KEY(ownerID) REFERENCES users(id)
        );    
    `);
} 

module.exports = { resetDb, run, db }; 