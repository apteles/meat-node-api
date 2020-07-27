"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
const authz_handler_1 = require("../security/authz.handler");
class ReviewsRouter extends model_router_1.default {
    constructor() {
        super(reviews_model_1.default);
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restID = document.restaurant._id || document.restaurant;
        resource._links.restaurant = `/restaurants/${restID}`;
        return resource;
    }
    // findById = async (req:Request,res:Response,next:Next) => {
    //   try {
    //     const model = await this.model.findById(req.params.id).populate('user','name').populate('restaurant')
    //     return this.render(res,next)(model)
    //   } catch (error) {
    //       next(error)
    //   }
    // }
    prepareOne(query) {
        return query.populate('user', 'name').populate('restaurant', 'name');
    }
    applyRoutes(application) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', [authz_handler_1.authorize('user'), this.save]);
    }
}
exports.default = new ReviewsRouter;
