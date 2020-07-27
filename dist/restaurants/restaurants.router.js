"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
const restaurants_model_1 = require("../restaurants/restaurants.model");
const authz_handler_1 = require("../security/authz.handler");
class RestaurantsRouter extends model_router_1.default {
    constructor() {
        super(restaurants_model_1.default);
        this.findMenu = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield restaurants_model_1.default.findById(req.params.id, "+menu");
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                return this.render(res, next)(restaurant);
            }
            catch (error) {
                next(error);
            }
        });
        this.replaceMenu = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield restaurants_model_1.default.findById(req.params.id);
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                restaurant.menu = req.body;
                return this.render(res, next)(yield restaurant.save());
            }
            catch (error) {
                next(error);
            }
        });
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [authz_handler_1.authorize('admin'), this.validateId, this.replaceMenu]);
    }
}
exports.default = new RestaurantsRouter;
