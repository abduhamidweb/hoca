import express from 'express';
import ContactController from '../controllers/contact.contr.js';
import authMiddleware from '../middleware/auth';
let router = express.Router();
router.get('/', ContactController.getContacts)
router.get('/:id', ContactController.getContactById)
router.post("/", authMiddleware, ContactController.createContact)
router.put("/", authMiddleware, ContactController.updateContact)
router.delete("/", authMiddleware, ContactController.deleteContact)
export default router