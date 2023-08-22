import { JWT } from '../utils/jwt';
import { Request, Response } from 'express';
import { IContact } from '../interface/interface'; 
// import userModel from '../schemas/user.schema.js';
import ContactModel from '../schemas/contact.schema.js';
class ContactController {
    static async getContacts(req: Request, res: Response) {
        try {
            const contacts = await ContactModel.find();
            res.status(200).send({
                success: true,
                data: contacts
            });
        }
        catch (error: any) {
            console.log('error.message :', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }
    static async getContactById(req: Request, res: Response) {
        try {
            let contactId = req.params.id
            const contacts = await ContactModel.findById(contactId);
            res.status(200).send({
                success: true,
                data: contacts
            });
        }
        catch (error: any) {
            console.log('error.message :', error.message);
            res.status(500).send({ success: false, error: error.message });
        }
    }
    static async createContact(req: Request, res: Response) {
        try {
            let token = req.headers.token as string;
            let id = JWT.VERIFY(token).id;
            if (!id) {
                throw new Error("Invalid Id");
             }
            const { fullName, email, phone, content, userId }: IContact = req.body;
            const newContactData = {
                fullName,
                email,
                phone,
                content,
                userId,
            };
            const newContact = new ContactModel(newContactData);
            const savedContact = await newContact.save();


            // Userning posts uchun 
            // userModel.findByIdAndUpdate(id, {
                // $push: {
                    // posts:savedContact._id
                // }
            // })
            // /////////////////////////////////////////////////
            res.status(201).send({
                success: true,
                data: savedContact
            });
        } catch (error: any) {
            console.log('error.message :', error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

export default ContactController;
