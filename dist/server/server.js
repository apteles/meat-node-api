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
exports.Server = void 0;
const Restify = require("restify");
const mongoose = require("mongoose");
const env_1 = require("../common/env");
const merge_path_parser_1 = require("./merge-path.parser");
const error_handler_1 = require("./error.handler");
const token_parse_1 = require("../security/token.parse");
class Server {
    initializeDB() {
        return mongoose.connect(env_1.env.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = Restify.createServer({
                    name: 'meat-api',
                    versions: ['1.0.0', '2.0.0'],
                });
                console.log(__dirname);
                this.application.use(Restify.plugins.queryParser());
                this.application.use(Restify.plugins.bodyParser());
                this.application.use(merge_path_parser_1.default);
                this.application.use(token_parse_1.tokenParser);
                routers.forEach((router) => router.applyRoutes(this.application));
                this.application.listen(env_1.env.server.port, () => resolve(this.application));
                this.application.on('restifyError', error_handler_1.default);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.initializeDB().then(() => this.initRoutes(routers).then(() => this));
        });
    }
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose.disconnect();
            yield this.application.close();
        });
    }
}
exports.Server = Server;
