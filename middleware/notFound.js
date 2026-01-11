const { httpError } = require("./httpError"); 

function notFound(req, res, next) { 
    next(httpError(404, "NOT_FOUND", `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { notFound }; 