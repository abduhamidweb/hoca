import validator from "validator";
import { isEmailValid } from "../middleware/email.cheker.js";
import { Schema, model, Types } from 'mongoose';
const contactSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: isEmailValid,
            message: 'Invalid email address',
        },
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                return validator.isNumeric(value);
            }
        }
    },
    content: {
        type: String, required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
});
export default model('Contact', contactSchema);
