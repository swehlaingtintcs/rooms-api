const express = require("express"); 
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const { requireAuth } = require("../middleware/auth");
const router = express.Router(); 
const usersRepo = require("../db/usersRepo");
const { httpError }  = require("../middleware/httpError"); 
const { validate }  = require("../middleware/validate"); 
const { registerValidators, loginValidators } = require("../validators/auth.validators"); 

router.post("/register", validate(registerValidators), (req, res, next) => { 
    const { email, password } = req.body; 

    bcrypt.hash(password, 10, (err, passwordHash) => { 
        if (err) return next(err); 

        usersRepo.createUser(email, passwordHash, (err2, user) => { 
            if (err2) { 
                if (String(err2.message).includes("UNIQUE")) { 
                    return next(httpError(409, "EMAIL_ALREADY_REGISTERED", "Email already registered")); 
                }
                return next(err2); 
            }
            return res.status(201).json({ id: user.id, email: user.email }); 
        });
    });
});

router.post("/login", validate(loginValidators), (req, res, next) => { 
    const { email, password } = req.body; 

    usersRepo.getUserByEmail(email, (err, user) => { 
        if (err) return next(err); 
        if (!user) return next(httpError(401, "INVALID_CREDENTIALS", "Invalid credentials")); 

        bcrypt.compare(password, user.passwordHash, (err2, same) => { 
            if (err2) return next(err2); 
            if(!same) return next(httpError(401, "INVALID CREDENTIALS", "Invalid credentials")); 
            
            const token = jwt.sign(
                { id: user.id, email: user.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: "2h"}
            );

            return res.json({ token }); 
        });
    });
}); 

router.get("/me", requireAuth, (req, res) => { 
    const { id, email } = req.user; 
    return res.json({ id, email });  
}); 

module.exports = router; 