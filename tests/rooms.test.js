const request = require("supertest"); 
const bcrypt = require("bcrypt"); 
const app = require("../app"); 
const { resetDb, run, db } = require("./helpers/resetDb"); 

async function seedAndLogin() { 
    const passwordHash = await bcrypt.hash("pass1234", 10); 
    await run(`INSERT INTO users(email, passwordHash) VALUES (?, ?)`, ["roomowner@example.com", passwordHash,]); 

    const login = await request(app)
        .post("/auth/login")
        .send({ email: "roomowner@example.com", password: "pass1234" }); 
    
    return login.body.token; 
}

describe("Room routes", () => { 
    let token; 

    beforeEach(async () => { 
        await resetDb(); 
        token = await seedAndLogin(); 
    })

    test("POST /rooms -> 201 creates a room", async () => { 
        const res = await request(app) 
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`) 
            .send({ title: "Nice place", pricePerNight: 100} ); 

        expect(res.statusCode).toBe(201); 
        expect(res.body).toHaveProperty("id"); 
        expect(res.body.title).toBe("Nice place"); 
    })

    test("GET /rooms -> 200 returns rooms array", async () => { 
        const res = await request(app)
            .get("/rooms");

        expect(res.statusCode).toBe(200); 
        expect(Array.isArray(res.body)).toBe(true); 
    });

    test("GET /rooms/abc -> 400 validation error", async () => { 
        const res = await request(app)
            .get("/rooms/abc"); 
         
        expect(res.statusCode).toBe(400); 
        expect(res.body).toHaveProperty("error"); 
    });

    test("PATCH /rooms/:id -> 200 updates one field", async () => { 
        const created = await request(app) 
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`) 
            .send({ title: "Old title", pricePerNight: 50 }); 

        const roomId = created.body.id; 

        const res = await request(app) 
            .patch(`/rooms/${roomId}`) 
            .set("Authorization", `Bearer ${token}`) 
            .send({ title: "New title" }); 

        expect(res.statusCode).toBe(200); 
        expect(res.body).toHaveProperty("message"); 
    });

    afterAll(async () => { 
        await new Promise((resolve, reject) => { 
            db.close((err) => (err ? reject(err) : resolve())); 
        });
    });
});