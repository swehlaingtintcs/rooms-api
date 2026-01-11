const { db } = require("./database"); 

function createUser(email, passwordHash, callback) { 
    const sql = "INSERT INTO users (email, passwordHash) VALUES (?, ?)"; 

    db.run(sql, [email, passwordHash], function(err) { 
        if (err) return callback(err); 

        callback(null, { 
            id: this.lastID, 
            email: email, 
        });
    });
}

function getUserByEmail(email, callback) { 
    const sql = "SELECT * FROM users WHERE email = ?"; 
    db.get(sql, [email], callback); 
}

module.exports = { 
    createUser, 
    getUserByEmail, 
};