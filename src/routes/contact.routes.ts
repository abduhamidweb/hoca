import express from 'express';
import ContactController from '../controllers/contact.contr';
import authMiddleware from '../middleware/auth';
let router = express.Router();
router.get('/', ContactController.getContacts)
router.get('/:id', ContactController.getContactById)
router.post("/", authMiddleware, ContactController.createContact)
export default router