import validator from "validator";
import { IContact } from '../interface/interface.js';
import { isEmailValid } from "../middleware/email.cheker.js";
import mongoose, { Schema, Document, model, Types } from 'mongoose';
const contactSchema = new Schema<IContact>({
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
            validator: (value: string) => {
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

export default model<IContact>('Contact', contactSchema);
