const jwt = require("jsonwebtoken"); 
const { httpError } = require("./httpError"); 

function requireAuth(req, res, next) { 
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Bearer ")) { 
        return next(httpError(401, "AUTH_MISSING_TOKEN", "Missing or invalid Authorization header"));
    }

    const token = authHeader.split(" ")[1]; 

    try { 
        const payload = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = payload 
        return next(); 
    }
    catch (err) { 
        return next(httpError(401, "AUTH_INVALID_TOKEN", "Invalid or expired token")); 
    }
}

module.exports = { requireAuth }; 