import express from "express";
import { User } from "../tabels";

export const auth = express.Router();

// check if already logged in
auth.get("/login", (req, res) => res.json(!!req.session.user));

// Login
auth.post("/login", async (req, res): Promise<any> => {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json(false);

    const rows = await User.select("*", [{ username }]);

    if (rows.length === 0)
        return res.status(400).json(false);

    const user = rows[0]!;

    if (user.password === password) {
        req.session.user = username;
        res.json(true);
    }
    else {
        res.json(false);
    }

});

// Logout
auth.post("/logout", (req, res) => {
    req.session.user = undefined;
    req.session.destroy((err: any) => {
        if (err)
            console.warn(err);
        res.send(!err);
    });
});