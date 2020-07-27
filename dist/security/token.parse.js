"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenParser = void 0;
const jwt = require("jsonwebtoken");
const users_model_1 = require("../users/users.model");
const env_1 = require("../common/env");
exports.tokenParser = (req, res, next) => {
    const token = extractToken(req);
    if (token) {
        jwt.verify(token, env_1.env.apiSecret, applyBearer(req, next));
    }
    else {
        next();
    }
};
function extractToken(req) {
    const authorization = req.header('authorization');
    if (authorization) {
        const parts = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
    }
    return undefined;
}
function applyBearer(req, next) {
    return (error, decoded) => {
        if (decoded) {
            users_model_1.default.findByEmail(decoded.sub).then(user => {
                if (user) {
                    req.authenticated = user;
                }
                next();
            }).catch(next);
        }
        else {
            next();
        }
    };
}
