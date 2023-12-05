import "./env";

import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";

import { api } from "./api";
//import { Veeam, Telefoon, VeaamSqldb, Service } from "./services";
import { DB } from "./db";

import MySQLStore from "express-mysql-session";

const SessionStore = MySQLStore(session as any);

const start = async () => {
    let dbStarted = false;
    try {
        await DB.initialize();
        dbStarted = true;
        //Service.start(Veeam, Telefoon, VeaamSqldb);
    }
    catch (e) {
        console.log(e);
    }

    const { HOST = "localhost", PORT = 8080, VITE_DEV_PORT = 8081, SESSION_SECRET = "123" } = process.env;

    const app = express();

    app.use(session({
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
        }, DB.get().getPool()) : undefined
    }));

    app.use((req, res, next) => {
        if (process.env.NODE_ENV !== "development")
            return next();

        const startTime = performance.now();
        res.on("finish", () => console.log(`[${req.method}] ${req.url}: ${performance.now() - startTime}ms`));
        next();
    });

    app.use(cors());

    app.use(express.json());
    app.use(express.static(path.resolve(__dirname, "./public")));

    app.use("/api", api);

    app.listen(PORT, () => {
        if (process.env.NODE_ENV === "development") {
            console.log(`Server listening on http://${HOST}:${VITE_DEV_PORT}...`);
        }
        else {
            console.log(`Server listening on https://${HOST}:${PORT}...`);
        }
    });
};

start();
