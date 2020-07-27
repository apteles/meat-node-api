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
const restify_errors_1 = require("restify-errors");
const mongoose_1 = require("mongoose");
const router_1 = require("./router");
class ModelRouter extends router_1.default {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 4;
        this.validateId = (req, res, next) => {
            if (!mongoose_1.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        this.findAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            const skipPage = (page - 1) * this.pageSize;
            try {
                const model = yield this.model.find().skip(skipPage).limit(this.pageSize);
                const count = yield this.model.count({});
                return this.renderAll(res, next, { page, count, pageSize: this.pageSize, url: req.url })(model);
            }
            catch (error) {
                next(error);
            }
        });
        this.findById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const model = yield this.prepareOne(this.model.findById(req.params.id));
                return this.render(res, next)(model);
            }
            catch (error) {
                next(error);
            }
        });
        this.save = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let model = new this.model(req.body);
                model = yield model.save();
                return this.render(res, next)(model);
            }
            catch (error) {
                next(error);
            }
        });
        this.replace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.update({ _id: req.params.id }, req.body, { overwrite: true, runValidators: true });
            if (model.ok) {
                res.json(yield this.model.findById(req.params.id));
                return next();
            }
            throw new restify_errors_1.NotFoundError('Document not found');
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            return this.render(res, next)(model);
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const model = yield this.model.remove({ _id: req.params.id }, req.body);
            if (model.ok) {
                res.json(204);
                return next();
            }
            res.send(404);
            return next();
        });
        this.basePath = `/${this.model.collection.name}`;
    }
    envelope(document) {
        let resource = Object.assign({ _links: {} }, document.toJSON() || document);
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }
    envelopeAll(documents, options = {}) {
        const resource = {
            _links: {
                self: ``
            },
            items: documents
        };
        if (options.page && options.count && options.pageSize) {
            const remaining = options.count - (options.page * options.pageSize);
            if (remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
        }
        return resource;
    }
    prepareOne(query) {
        return query;
    }
}
exports.default = ModelRouter;
