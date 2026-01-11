const { httpError } = require("./httpError"); 

function validate(validators) { 
    const list = Array.isArray(validators) ? validators : [validators]; 

    return (req, res, next) => { 
        const errors = []; 

        for (const v of list) { 
            const msg = v(req); 
            if (msg) errors.push(msg); 
        }

        if (errors.length > 0) { 
            return next(httpError(400, "VALIDATION_ERROR", "Validation failed", errors)); 
        }

        return next(); 
    }
}

module.exports = { validate }; 