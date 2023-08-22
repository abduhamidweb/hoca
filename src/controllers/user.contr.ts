import { Request, Response } from "express";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
  async get(req: Request, res: Response) {},
  async post(req: Request, res: Response) {
    try {
      let { userEmail, password, role } = req.body;
      if (!userEmail || !password)
        return res.status(400).json({ message: "Invalid data" });
      if (role && !["user", "admin"].includes(role))
        return res.status(400).json({ message: "Invalid role" });
      let user = new userSchema({
        userEmail,
        password,
        role,
      });
        await user.save()
        res.status(201).json({
          token: JWT.SIGN({
            id: user._id,
          }),
          data: user,
        });

    } catch (error: any) {
        res.status(500).json({ message : error.message});
    }
  },
  async put(req: Request, res: Response) {},
  async login(req: Request, res: Response) {},
  async delete(req: Request, res: Response) {},
};
