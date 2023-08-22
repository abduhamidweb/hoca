import { Request, Response } from "express";
import sha256 from "sha256";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
  async get(req: Request, res: Response) {
    try { 
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      const user = await userSchema.findById(userId).populate("posts");
      if (user?.role == "user") {
        return res.status(200).json(user);
    } else if (user?.role == "admin") {
          let allUser = await userSchema.find()
        return res.status(200).json(allUser);
      }
    } catch (error:any) {
        res.status(500).json({message:error.message});
    }
  },
  async post(req: Request, res: Response) {
    try {
      let { userEmail, password, role } = req.body;
      if (!userEmail || !password)
        return res.status(400).json({ message: "Invalid data" });
      if (role && !["user", "admin"].includes(role))
        return res.status(400).json({ message: "Invalid role" });
      let user = new userSchema({
        userEmail,
        password: sha256(password),
        role,
      });
      await user.save();
      res.status(201).json({
        token: JWT.SIGN({
          id: user._id,
        }),
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async put(req: Request, res: Response) {},
  async login(req: Request, res: Response) {},
  async delete(req: Request, res: Response) {},
};
