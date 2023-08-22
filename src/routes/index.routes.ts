import express from "express";
import contactRouter from "./contact.routes.js"
import userRouter from "./user.routes.js"
const router = express.Router();
router.use('/test', () => { });
router.use('/users',userRouter);
export default router
