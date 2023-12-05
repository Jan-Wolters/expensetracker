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
exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const tabels_1 = require("../tabels");
exports.auth = express_1.default.Router();
// check if already logged in
exports.auth.get("/login", (req, res) => res.json(!!req.session.user));
// Login
exports.auth.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json(false);
    const rows = yield tabels_1.User.select("*", [{ username }]);
    if (rows.length === 0)
        return res.status(400).json(false);
    const user = rows[0];
    if (user.password === password) {
        req.session.user = username;
        res.json(true);
    }
    else {
        res.json(false);
    }
}));
// Logout
exports.auth.post("/logout", (req, res) => {
    req.session.user = undefined;
    req.session.destroy((err) => {
        if (err)
            console.warn(err);
        res.send(!err);
    });
});
