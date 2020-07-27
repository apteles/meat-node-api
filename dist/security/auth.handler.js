"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt = require("jsonwebtoken");
const restify_errors_1 = require("restify-errors");
const users_model_1 = require("../users/users.model");
const env_1 = require("../common/env");
exports.authenticate = (req, res, next) => {
    const { email, password } = req.body;
    users_model_1.default.findByEmail(email).then(user => {
        if (user && user.matches(password)) {
            const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, env_1.env.apiSecret);
            res.json({
                name: user.name,
                email: user.email,
                token
            });
            return next();
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid credentials'));
        }
    }).catch(next);
};
