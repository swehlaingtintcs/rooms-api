const { db } = require("./database"); 

function getAll(callback) { 
    db.all("SELECT * FROM rooms", callback); 
}

function getByID(id, callback) { 
    db.get("SELECT * FROM rooms WHERE id = ?", [id], callback); 
}

function create(title, pricePerNight, ownerID, callback) { 
    const sql = "INSERT INTO rooms (title, pricePerNight, ownerID) VALUES (?, ?, ?)"; 

    db.run(sql, [title, pricePerNight, ownerID], function (err) { 
        if (err) return callback(err); 

        callback(null, { 
            id: this.lastID, 
            title, 
            pricePerNight, 
            ownerID,
        });
    });
}

function update(id, title, pricePerNight, ownerID, callback) { 
    const sql = `
    UPDATE rooms 
    SET title = ?, pricePerNight = ? 
    WHERE id = ? AND ownerID = ?
    `; 
    db.run(sql, [title, pricePerNight, id, ownerID], function(err) { 
        if (err) return callback(err); 

        const updated = this.changes > 0; 
        callback(null, updated); 
    });
}

function remove(id, ownerID, callback) { 
    db.run("DELETE FROM rooms WHERE id = ? AND ownerID = ?", [id, ownerID], function (err) { 
        if (err) return callback(err); 

        const deleted = this.changes > 0; 
        callback(null, deleted); 
    });
}

function getAllWithFilters(filters, callback) { 
    const whereParts = []; 
    const params = []; 

    if (filters.minPrice !== undefined) { 
        const min = Number(filters.minPrice); 
        if (!Number.isNaN(min)) { 
            whereParts.push("pricePerNight >= ?"); 
            params.push(min); 
        }
    }

    if (filters.maxPrice !== undefined) { 
        const max = Number(filters.maxPrice); 
        if (!Number.isNaN(max)) { 
            whereParts.push("pricePerNight <= ?"); 
            params.push(max); 
        }
    }

    if (filters.search !== undefined && String(filters.search).trim() !== "") { 
        whereParts.push("title LIKE ?"); 
        params.push(`%${filters.search}%`); 
    }

    const whereSQL = whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : ""; 

    let limitSQL = ""; 
    const limitNum = Number(filters.limit); 
    const offsetNum = Number(filters.offset);  

    if (!Number.isNaN(limitNum) && limitNum > 0) { 
        limitSQL += " LIMIT ? "; 
        params.push(limitNum); 

        if (!Number.isNaN(offsetNum) && offsetNum >= 0) { 
            limitSQL += " OFFSET ? "; 
            params.push(offsetNum); 
        }
    }

    const sql = `SELECT * FROM rooms ${whereSQL}${limitSQL}`; 

    db.all(sql, params, callback); 
}

function patch(id, title, pricePerNight, ownerID, callback) { 
    const fields = []; 
    const params = []; 

    if (title !== undefined) { 
        fields.push("title = ?"); 
        params.push(title); 
    }

    if (pricePerNight !== undefined) { 
        fields.push("pricePerNight = ?"); 
        params.push(pricePerNight); 
    }

    if (fields.length === 0) { 
        return callback(null, null); 
    }

    const sql = `
    UPDATE rooms 
    SET ${fields.join(", ")}
    WHERE id = ? AND ownerID = ?
    `; 

    params.push(id, ownerID); 

    db.run(sql, params, function(err) { 
        if (err) return callback(err); 
        if (this.changes === 0) return callback(null, null); 
        db.get("SELECT * FROM rooms WHERE id = ?", [id], (err2, room) => { 
            if (err2) return callback(err2); 
            return callback(null, room); 
        });
    });
}


module.exports = { 
    getAll, 
    getByID, 
    create, 
    remove, 
    getAllWithFilters, 
    update, 
    patch, 
};
