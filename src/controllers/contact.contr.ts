import { JWT } from "../utils/jwt.js";
import { Request, Response } from "express";
import { IContact, IUpdateContact } from "../interface/interface";
import userModel from '../schemas/user.schema.js';
import ContactModel from "../schemas/contact.schema.js";
import error from "../Responser/error.js";
class ContactController {
  static async getContacts(req: Request, res: Response) {
    try {
      const contacts = await ContactModel.find();
      res.status(200).send({
        success: true,
        data: contacts,
      });
    } catch (error: any) {
      console.log("error.message :", error.message);
      res.status(500).send({ success: false, error: error.message });
    }
  }
  static async getContactById(req: Request, res: Response) {
    try {
      let contactId = req.params.id;
      const contacts = await ContactModel.findById(contactId);
      res.status(200).send({
        success: true,
        data: contacts,
      });
    } catch (error: any) {
      console.log("error.message :", error.message);
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
      const { fullName, email, phone, content }: IContact = req.body;
      const newContactData = {
        fullName,
        email,
        phone,
        content,
        userId:id,
      };
      const newContact = new ContactModel(newContactData);
      const savedContact = await newContact.save();

      // Userning posts uchun
     await userModel.findByIdAndUpdate(id, {
      $push: {
      posts:savedContact._id
      }
      })
      // /////////////////////////////////////////////////
      res.status(201).send({
        success: true,
        data: savedContact,
      });
    } catch (error: any) {
      console.log("error.message :", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateContact(req: Request, res: Response) {
    try {
      let token = req.headers.token as string;
      let id = JWT.VERIFY(token).id;
      if (!id) {
        throw new Error("Invalid Id");
      }
      const contact_id = req.params.id;
      const updateData: IUpdateContact = req.body;

      if (Object.keys(updateData).length === 0) {
        return error(res, "No data provided for update.", 400);
      }

      const check_id = await ContactModel.findById(contact_id);

      if (!check_id) {
        return res.status(404).json({ message: "Contact not found." });
      }

      const updatedContact = await ContactModel.findByIdAndUpdate(
        { _id: contact_id, ...updateData },
        { new: true }
      );

      res.send({
        status: 200,
        message: `Contact was updated successfuly!`,
        success: true,
        data: updatedContact,
      });
    } catch (error: any) {
      console.log("error.message :", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
 
  static async deleteContact(req: Request, res: Response) {
    try {
      let token = req.headers.token as string;
      let id = JWT.VERIFY(token).id;
      if (!id) {
        throw new Error("Invalid Id");
      }
      const contact_id = req.params.id;

      const check_id = await ContactModel.findById(contact_id);

      if (!check_id) {
        return res.status(404).json({ message: "Contact not found." });
      }
      const deletedContact = await ContactModel.findByIdAndDelete(id);

      res.send({
        status: 200,
        message: `Contact was deleted successfuly!`,
        success: true,
        data: deletedContact,
      });
    } catch (error: any) {
      console.log("error.message :", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default ContactController;
