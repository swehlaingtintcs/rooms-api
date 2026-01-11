function httpError(status, code, message, details = undefined) { 
    const err = new Error(message); 
    err.status = status; 
    err.code = code; 
    err.details = details; 
    return err; 
}

module.exports = { httpError }; 