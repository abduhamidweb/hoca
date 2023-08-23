import { isEmailValid } from "../middleware/email.cheker.js";
import mongoose, { Schema, model } from "mongoose";
const UserChema = new Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: isEmailValid,
            message: "Invalid email address",
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Contact"
        }
    ]
});
export default model("User", UserChema);
