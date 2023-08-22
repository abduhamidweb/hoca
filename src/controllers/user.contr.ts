import { Request, Response } from "express";
import sha256 from "sha256";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    async get(req: Request, res: Response) { },
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
            await user.save()
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
    async put(req: Request, res: Response) {
        const { id } = req.params;
        let { userEmail, password } = req.body;
        const hashedPass = sha256(password)

        try {
            const userPut = await userSchema.findByIdAndUpdate(id, { userEmail, hashedPass: password }, { new: true });

            if (!userPut) {
                res.status(404).json({ error: 'Email or password not found' });
            }
            res.status(200).json({ message: "Email and password succesfully edited", data: userPut });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
    async login(req: Request, res: Response) {
        let { userEmail, password } = req.body;

        try {
            let user: any = await userSchema.findOne({
                userEmail,
                password: sha256(password),
            });
            if (!user) {
                res.status(404).json({ error: 'Email or password wrong' });
            }
            res.status(200).json({
                token: JWT.SIGN({
                    id: user._id,
                }),
            });

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    },
    async delete(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const deletedUser = await userSchema.findByIdAndDelete(id);

            if (!deletedUser) {
                res.status(404).json({ error: 'Email or password wrong' });
            }
            res.status(200).json({ message: "User successfully deleted" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
};
