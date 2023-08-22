var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sha256 from "sha256";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const user = yield userSchema.findById(userId).populate("posts");
                if ((user === null || user === void 0 ? void 0 : user.role) == "user") {
                    return res.status(200).json(user);
                }
                else if ((user === null || user === void 0 ? void 0 : user.role) == "admin") {
                    let allUser = yield userSchema.find().populate("posts");
                    return res.status(200).json(allUser);
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield user.save();
                res.status(201).json({
                    token: JWT.SIGN({
                        id: user._id,
                    }),
                    data: user,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let { userEmail, password } = req.body;
            const hashedPass = sha256(password);
            try {
                const userPut = yield userSchema.findByIdAndUpdate(id, { userEmail, hashedPass: password }, { new: true });
                if (!userPut) {
                    res.status(404).json({ error: 'Email or password not found' });
                }
                res.status(200).json({ message: "Email and password succesfully edited", data: userPut });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { userEmail, password } = req.body;
            try {
                let user = yield userSchema.findOne({
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
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const deletedUser = yield userSchema.findByIdAndDelete(id);
                if (!deletedUser) {
                    res.status(404).json({ error: 'Email or password wrong' });
                }
                res.status(200).json({ message: "User successfully deleted" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
};
