import mongoose, { Document, Types } from 'mongoose';
export interface IContact extends Document {
    fullName: string;
    email: string;
    phone: string;
    content: string;
    userId: Types.ObjectId | undefined;
}

export interface IUpdateContact extends Partial<IContact> {}