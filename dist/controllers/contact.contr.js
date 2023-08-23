var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWT } from "../utils/jwt.js";
import userModel from '../schemas/user.schema.js';
import ContactModel from "../schemas/contact.schema.js";
import error from "../Responser/error.js";
class ContactController {
    static getContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield ContactModel.find().populate("userId");
                res.status(200).send({
                    success: true,
                    data: contacts,
                });
            }
            catch (error) {
                console.log("error.message :", error.message);
                res.status(500).send({ success: false, error: error.message });
            }
        });
    }
    static getContactById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let contactId = req.params.id;
                const contacts = yield ContactModel.findById(contactId).populate('userId');
                res.status(200).send({
                    success: true,
                    data: contacts,
                });
            }
            catch (error) {
                console.log("error.message :", error.message);
                res.status(500).send({ success: false, error: error.message });
            }
        });
    }
    static createContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                let id = JWT.VERIFY(token).id;
                if (!id) {
                    throw new Error("Invalid Id");
                }
                const { fullName, email, phone, content } = req.body;
                const newContactData = {
                    fullName,
                    email,
                    phone,
                    content,
                    userId: id,
                };
                const newContact = new ContactModel(newContactData);
                const savedContact = yield newContact.save();
                // Userning posts uchun
                yield userModel.findByIdAndUpdate(id, {
                    $push: {
                        posts: savedContact._id,
                    },
                });
                // /////////////////////////////////////////////////
                res.status(201).send({
                    success: true,
                    data: savedContact,
                });
            }
            catch (error) {
                console.log("error.message :", error.message);
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    static updateContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                let id = JWT.VERIFY(token).id;
                if (!id) {
                    throw new Error("Invalid Id");
                }
                const contact_id = req.params.id;
                const updateData = req.body;
                if (Object.keys(updateData).length === 0) {
                    return error(res, "No data provided for update.", 400);
                }
                const check_id = yield ContactModel.findById(contact_id);
                if (!check_id) {
                    return res.status(404).json({ message: "Contact not found." });
                }
                const updatedContact = yield ContactModel.findByIdAndUpdate(Object.assign({ _id: contact_id }, updateData), { new: true });
                res.send({
                    status: 200,
                    message: `Contact was updated successfuly!`,
                    success: true,
                    data: updatedContact,
                });
            }
            catch (error) {
                console.log("error.message :", error.message);
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
    static deleteContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                let id = JWT.VERIFY(token).id;
                if (!id) {
                    throw new Error("Invalid Id");
                }
                const contact_id = req.params.id;
                const check_id = yield ContactModel.findById(contact_id);
                if (!check_id) {
                    return res.status(404).json({ message: "Contact not found." });
                }
                const deletedContact = yield ContactModel.findByIdAndDelete(id);
                res.send({
                    status: 200,
                    message: `Contact was deleted successfuly!`,
                    success: true,
                    data: deletedContact,
                });
            }
            catch (error) {
                console.log("error.message :", error.message);
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default ContactController;
