function errorHandler(err, req, res, next) { 
    const status = err.status || 500; 
    const code = err.code || "INTERNAL_SERVER_ERROR"; 
    
    const message = 
        status === 500 ? "Something went wrong" : (err.message || "Request failed"); 

    console.error("ERROR:", { 
        status,
        code, 
        message: err.message, 
        details: err.details, 
        stack: err.stack, 
    });

    return res.status(status).json({ 
        error: { 
            status, 
            code, 
            message, 
            details: err.details, 
        },
    });
}

module.exports = { errorHandler }; 