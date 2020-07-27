"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    server: { port: process.env.PORT || 3000 },
    db: { url: process.env.PORT || 'mongodb://localhost/meat-api' },
    apiSecret: process.env.API_SECRET || 'meat-api'
};
