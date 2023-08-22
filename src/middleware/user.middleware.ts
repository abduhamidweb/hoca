import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import err from "../Responser/error.js";
import userSchema from "../schemas/user.schema.js";
import Users from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";

export default {
  async tokenChecker(req: Request, res: Response, next: NextFunction) {
    try {
       const token = req.headers.token as string;
       const userId = JWT.VERIFY(token).id;
      const user = await userSchema.findById(userId);
      if (!user) {
        throw new Error()
      } 
next()
    } catch (error:any) {
      res.status(403).json({message:
      "Invalid token"})
    }
  }
}
