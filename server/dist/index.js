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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const api_1 = require("./api");
const services_1 = require("./services");
const db_1 = require("./db");
const express_mysql_session_1 = __importDefault(require("express-mysql-session"));
const SessionStore = (0, express_mysql_session_1.default)(express_session_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    let dbStarted = false;
    try {
        yield db_1.DB.initialize();
        dbStarted = true;
        services_1.Service.start(services_1.Telefoon);
    }
    catch (e) {
        console.log(e);
    }
    const { HOST = "localhost", PORT = 8080, VITE_DEV_PORT = 8081, SESSION_SECRET = "123" } = process.env;
    const app = (0, express_1.default)();
    app.use((0, express_session_1.default)({
        name: "ssid",
        resave: true,
        rolling: true,
        saveUninitialized: true,
        secret: SESSION_SECRET,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 // 1000ms * 60sec * 60min * 24hours = 1day
        },
        store: dbStarted ? new SessionStore({
            createDatabaseTable: true,
            schema: {
                tableName: "auth-sessions",
            }
        }, db_1.DB.get().getPool()) : undefined
    }));
    app.use((req, res, next) => {
        if (process.env.NODE_ENV !== "development")
            return next();
        const startTime = performance.now();
        res.on("finish", () => console.log(`[${req.method}] ${req.url}: ${performance.now() - startTime}ms`));
        next();
    });
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.static(path_1.default.resolve(__dirname, "./public")));
    app.use("/api", api_1.api);
    app.listen(PORT, () => {
        if (process.env.NODE_ENV === "development") {
            console.log(`Server listening on http://${HOST}:${VITE_DEV_PORT}...`);
        }
        else {
            console.log(`Server listening on https://${HOST}:${PORT}...`);
        }
    });
});
start();
