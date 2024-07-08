import express, {Request, Response, ErrorRequestHandler} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {db} from "./db";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { addUserToOrganisation, createOrganisation, getOrganisation, getOrganisations, getRecords, signIn, signUp } from "./controllers/controller";
import { verifyToken } from "./utils/verifyToken";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());  
app.get("/", (req:Request, res:Response) => {
    res.json({message:"Welcome to the API"});
})
app.post("/auth/register", signUp);
app.post("/auth/login", signIn)
app.get("/api/users/:id",verifyToken,getRecords)
app.get("/api/organisations",verifyToken,getOrganisations) 
app.get("/api/organisations/:orgId",verifyToken,getOrganisation)
app.post("/api/organisations",verifyToken,createOrganisation)  
app.post("/api/organisations/:orgId/users",verifyToken,addUserToOrganisation)  

app.use((err:any, req:any, res:any, next:any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({ 
      success: false, 
      statusCode,
      message,
    });
  });


 
export default app;