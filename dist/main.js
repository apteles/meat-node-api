"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const reviews_router_1 = require("./reviews/reviews.router");
const routes = [
    users_router_1.default,
    restaurants_router_1.default,
    reviews_router_1.default
];
const server = new server_1.Server;
server.bootstrap(routes).then((server) => {
    console.log('Console is running on port: ', server.application.address());
}).catch(err => {
    console.log('fail to start server:', err);
    process.exit(1);
});
