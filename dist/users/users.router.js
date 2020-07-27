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
const users_model_1 = require("../users/users.model");
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
class UsersRouter extends model_router_1.default {
    constructor() {
        super(users_model_1.default);
        this.findByEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.email) {
                    const user = yield users_model_1.default.find({ email: req.query.email });
                    return this.renderAll(res, next)(user);
                }
                else {
                    next();
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        //application.get({path:'/users', version:'2.0.0'}, [this.findByEmail,this.findAll]);
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, [authz_handler_1.authorize('admin'), this.findAll]);
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        // Here user just can update your own data.
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.default = new UsersRouter;
