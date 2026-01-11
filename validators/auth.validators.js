function isNonEmptyString(value) { 
    return typeof value === "string" && value.trim().length > 0; 
}

function isValidEmail(email) { 
    if (!isNonEmptyString(email)) return false; 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateRegister(req) { 
    const { email, password } = req.body; 
    const errors = []; 

    if (!isValidEmail(email)) { 
        errors.push("email must be a valid email address"); 
    }

    if (!isNonEmptyString(password)) { 
        errors.push("password is required and must be a non-empty string"); 
    } else if (password.trim().length < 8) { 
        errors.push("password must be at least 8 characters long"); 
    }

    return errors; 
}

function validateLogin(req) { 
    const { email, password } = req.body; 
    const errors = []; 

    if (!isValidEmail(email)) { 
        errors.push("email must be a valid email address"); 
    }

    if (!isNonEmptyString(password)) { 
        errors.push("password is required and must be a non-empty string"); 
    }

    return errors; 
}

function registerValidators(req) { 
    return validateRegister(req).join(" | ") || null; 
}

function loginValidators(req) { 
    return validateLogin(req).join(" | ") || null; 
}

module.exports = { registerValidators, loginValidators }; 