import { Request, Response, NextFunction } from "express";

export const checkAuth = (req: Request, res: Response, next: NextFunction): any => {
    if (!(req as any).session.user)
        return res.status(400).send({ error: "Not authenticated!" });
    next();
};
