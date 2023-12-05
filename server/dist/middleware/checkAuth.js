"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const checkAuth = (req, res, next) => {
    if (!req.session.user)
        return res.status(400).send({ error: "Not authenticated!" });
    next();
};
exports.checkAuth = checkAuth;
