"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MenuSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
const RestaurantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [MenuSchema],
        required: false,
        select: false,
        default: []
    }
});
exports.default = mongoose_1.model('Restaurant', RestaurantSchema);
