import express from "express";
import contactRouter from "./contact.routes.js"
const router = express.Router();
router.use('/test', () => { });
export default router
