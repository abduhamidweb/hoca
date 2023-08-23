import express from 'express';
import ContactController from '../controllers/contact.contr.js';
import authMiddleware from '../middleware/auth.js';
let router = express.Router();
router.get('/', ContactController.getContacts)
router.get('/:id', ContactController.getContactById)
router.post("/", authMiddleware, ContactController.createContact)
router.put("/:id", authMiddleware, ContactController.updateContact)
router.delete("/:id", authMiddleware, ContactController.deleteContact)
export default router