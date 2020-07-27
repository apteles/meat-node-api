"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const restify_errors_1 = require("restify-errors");
exports.authorize = (...profiles) => {
    return (req, res, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            next();
        }
        else {
            next(new restify_errors_1.ForbiddenError('Permission Denied'));
        }
    };
};
