const request = require("supertest"); 
const bcrypt = require("bcrypt"); 
const app = require("../app"); 
const { resetDb, run, db } = require("./helpers/resetDb"); 

describe ("Auth routes", () => { 
    beforeEach(async () => { 
        await resetDb(); 
    });

    test("POST /auth/register -> 201 creates a user", async () => { 
        const res = await request(app) 
            .post("/auth/register")
            .send({ email: "test@example.com", password: "pass1234" }); 
        
        expect(res.statusCode).toBe(201); 
        expect(res.body).toHaveProperty("id"); 
        expect(res.body.email).toBe("test@example.com");
    });

    test("POST /auth/register -> 409 duplicate email", async () => { 
        await request(app)
            .post("/auth/register")
            .send({ email: "test@example.com", password: "pass1234" })
            .expect(201);

        const res = await request(app) 
            .post("/auth/register")
            .send({ email: "test@example.com", password: "pass1234" }); 
        
        expect(res.statusCode).toBe(409); 
        expect(res.body).toHaveProperty("error"); 
    });

    test("POST /auth/login -> 200 returns token", async () => { 
        const passwordHash = await bcrypt.hash("pass1234", 10); 
        await run(`INSERT OR IGNORE INTO users(email, passwordHash) VALUES (?, ?)`, ["login@example.com" , passwordHash,]); 

        const res = await request(app)
            .post("/auth/login")
            .send({ email: "login@example.com", password: "pass1234" }); 
        
            expect(res.statusCode).toBe(200); 
            expect(res.body).toHaveProperty("token"); 
            expect(typeof res.body.token).toBe("string"); 
    }); 

    test("GET /auth/me -> 200 returns user when token is valid", async () => { 
        const regRes = await request(app) 
            .post("/auth/register")
            .send({ email: "login@example.com", password: "pass1234" }); 
        
        expect(regRes.statusCode).toBe(201); 

        const loginRes = await request(app)
            .post("/auth/login") 
            .send({ email: "login@example.com", password: "pass1234" }); 

        expect(loginRes.statusCode).toBe(200); 
    
        const token = loginRes.body.token; 
        expect(typeof token).toBe("string");

        const res = await request(app) 
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`); 

        expect(res.statusCode).toBe(200); 
        expect(res.body).toHaveProperty("id"); 
        expect(res.body).toHaveProperty("email"); 
    }); 

    afterAll(async () => { 
        await new Promise((resolve, reject) => { 
            db.close((err) => (err ? reject(err) : resolve())); 
        });
    });
});