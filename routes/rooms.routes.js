const express = require("express"); 
const router = express.Router(); 
const { requireAuth } = require("../middleware/auth"); 
const roomsRepo = require("../db/roomsRepo"); 
const { validate } = require("../middleware/validate"); 
const { 
    createRoomValidators, 
    patchRoomValidators,
    listRoomsValidators,
    roomIdValidators, 
    putRoomValidators, 
    deleteRoomValidators, 
} = require("../validators/rooms.validators"); 
const { httpError } = require("../middleware/httpError");

router.get("/", validate(listRoomsValidators), (req, res, next) => { 
    const { minPrice, maxPrice, limit, offset, search } = req.query; 

    roomsRepo.getAllWithFilters(
        { minPrice, maxPrice, limit, offset, search }, 
        (err, rooms) => { 
            if (err) return next(err); 
            return res.json(rooms); 
        }
    );
});

router.get("/:id", validate(roomIdValidators), (req, res, next) => { 
    const roomID = Number(req.params.id); 

    roomsRepo.getByID(roomID, (err, room) => { 
        if (err) return next(err); 
        if (!room) return next(httpError(404, "NOT_FOUND", "Room not found")); 
        return res.json(room); 
    });
});

router.post("/", requireAuth, validate(createRoomValidators), (req, res, next) => {
    const { title, pricePerNight } = req.body; 
    const ownerID = req.user.id; 
    const price = Number(pricePerNight); 

    roomsRepo.create(title, price, ownerID, (err, createdRoom) => { 
        if (err) return next(err); 
        return res.status(201).json(createdRoom); 
    });
});

router.delete("/:id", requireAuth, validate(deleteRoomValidators), (req, res, next) => { 
    const roomID = Number(req.params.id); 
    const userID = req.user.id; 

    roomsRepo.remove(roomID, userID, (err, deleted) => { 
        if (err) return next(err); 
        if (!deleted) return next(httpError(403, "FORBIDDEN", "Not authorized")); 
        return res.json({message: "Room deleted", deletedID: roomID}); 
    });
});

router.put("/:id", requireAuth, validate(putRoomValidators), (req, res, next) => { 
    const roomID = Number(req.params.id); 
    const ownerID = req.user.id; 
    const { title, pricePerNight } = req.body; 
    const price = Number(pricePerNight); 

    roomsRepo.update(roomID, title, price, ownerID, (err, updated) => { 
        if (err) return next(err); 
        if (!updated) return next(httpError(403, "FORBIDDEN", "Not authorized")); 

        return res.json({ 
            message: "Room updated", 
            id: roomID, 
            title, 
            pricePerNight: price, 
            ownerID, 
        });
    });
});

router.patch("/:id", requireAuth, validate([patchRoomValidators]), (req, res, next) => { 
    const roomID = Number(req.params.id); 
    const ownerID = req.user.id; 
    const { title, pricePerNight } = req.body; 
    const newPrice = 
        pricePerNight !== undefined ? Number(pricePerNight) : undefined; 

    roomsRepo.patch(roomID, title, newPrice, ownerID, (err, updatedRoom) => { 
        if (err) return next(err); 
        if (!updatedRoom) return res.status(403).json({error: "Not authorized or room not found."}); 

        return res.json({ message: "Room updated", room: updatedRoom}); 
    });
})

module.exports = router;