import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { handleError } from "./error";
import { CustomRequest } from "./types";



export const verifyToken = async (req:CustomRequest, res:Response, next:NextFunction) => {
    try {
        console.log(req.cookies["access_token"]);
        
        const token = req.cookies["access_token"];
        if (!token) return next(handleError(401, "Unauthorized"));
        const verifiedUser = jwt.verify(token, process.env.SECRET!);
        if (!verifiedUser) return next(handleError(403, "Forbidden"));
        req.verifiedUser = verifiedUser ;
        req.token = token;
        next();
    } catch (error) {
        next(error);
    }
}

