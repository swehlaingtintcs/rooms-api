function isNonEmptyString(value) { 
    return typeof value === "string" && value.trim().length > 0; 
}

function isNumber(value) { 
    return typeof value === "number" && !Number.isNaN(value); 
}

function isPositiveInt(value) { 
    return Number.isInteger(value) && value > 0; 
}

function isNonNegativeInt(value) { 
    return Number.isInteger(value) && value >= 0; 
}

function validateCreateRoom(req) { 
    const { title, pricePerNight } = req.body; 
    const errors = []; 

    if (!isNonEmptyString(title)) { 
        errors.push("title is required and must be a non-empty string"); 
    }

    if (pricePerNight === undefined) { 
        errors.push("pricePerNight is required"); 
    }
    else if (!isNumber(pricePerNight)) { 
        errors.push("pricePerNight must be a number"); 
    }
    else if (pricePerNight < 0) { 
        errors.push("pricePerNight must at least be 0"); 
    }

    return errors; 
}

function validatePatchRoom(req) { 
    const { title, pricePerNight } = req.body; 
    const errors = []; 

    const hasTitle = title !== undefined; 
    const hasPrice = pricePerNight !== undefined; 

    if (!hasTitle && !hasPrice) { 
        errors.push("Provide at least one field to update: title or pricePerNight"); 
        return errors; 
    }

    if (hasTitle && !isNonEmptyString(title)) { 
        errors.push("title must be a non-empty string"); 
    }

    if (hasPrice) { 
        if (!isNumber(pricePerNight)) errors.push("pricePerNight must be a number"); 
        else if (pricePerNight < 0) errors.push("pricePerNight must be >= 0"); 
    }

    return errors; 
}

function idParamMustBeNumber(req) { 
    const id = Number(req.params.id); 
    if (Number.isNaN(id)) return "id must be a number"; 
    return null; 
}

function minPriceMustBeNumberIfPresent(req) { 
    if (req.query.minPrice === undefined) return null; 
    const n = Number(req.query.minPrice); 
    if (Number.isNaN(n)) return "minPrice must be a number"; 
    if (n<0) return "minPrice must be >= 0"; 
    return null; 
}

function maxPriceMustBeNumberIfPresent(req) { 
    if (req.query.maxPrice === undefined) return null; 
    const n = Number(req.query.maxPrice); 
    if (Number.isNaN(n)) return "maxPrice must be a number"; 
    if (n<0) return "maxPrice must be >= 0"; 
    return null; 
}

function minPriceCannotExceedMaxPrice(req) { 
    if (req.query.minPrice === undefined || req.query.maxPrice === undefined) return null; 
    const min = Number(req.query.minPrice); 
    const max = Number(req.query.maxPrice); 
    if (Number.isNaN(min) || Number.isNaN(max)) return null; 
    if (min > max) return "minPrice cannot be greater than maxPrice"; 
    return null; 
}

function limitMustBePositiveIntIfPresent(req) { 
    if (req.query.list === undefined) return null; 
    const n = Number(req.query.list); 
    if (!Number.isInteger(n)) return "limit must be an integer"; 
    if (n <= 0) return "limit must be > 0"; 
    return null; 
}

function offsetMustBeNonNegativeIntIfPresent(req) { 
    if (req.query.offset === undefined) return null; 
    const n = Number(req.query.offset); 
    if (!Number.isInteger(n)) return "offset must be an integer"; 
    if (n < 0) return "offset must be >= 0"; 
    return null; 
}

function titleRequiredNonEmpty(req) { 
    const { title } = req.body; 
    if (!isNonEmptyString(title)) return "title is required and must be a non-empty string"; 
    return null; 
}

function pricePerNightRequiredNumber(req) { 
    const { pricePerNight } = req.body; 
    if (pricePerNight === undefined) return "pricePerNight is required";
    if (!Number.isNaN(pricePerNight)) return "pricePerNight must be a number"; 
    if (pricePerNight < 0) return "pricePerNight must be >= 0"; 
    return null; 
}

function createRoomValidators(req) { 
    return validateCreateRoom(req).join(" | ") || null; 
}

function patchRoomValidators(req) { 
    return validatePatchRoom(req).join(" | ") || null; 
}

const listRoomsValidators = [ 
    minPriceMustBeNumberIfPresent, 
    maxPriceMustBeNumberIfPresent, 
    minPriceCannotExceedMaxPrice, 
    limitMustBePositiveIntIfPresent, 
    offsetMustBeNonNegativeIntIfPresent, 
];

const roomIdValidators = [idParamMustBeNumber]; 

const putRoomValidators = [ 
    idParamMustBeNumber, 
    titleRequiredNonEmpty, 
    pricePerNightRequiredNumber, 
]; 

const deleteRoomValidators = [idParamMustBeNumber]; 

module.exports = { 
    createRoomValidators, 
    patchRoomValidators, 
    listRoomsValidators, 
    roomIdValidators, 
    putRoomValidators,
    deleteRoomValidators, 
};