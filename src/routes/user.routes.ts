import { Router } from "express";
import userContr from "../controllers/user.contr.js";
import userMiddleware from "../middleware/user.middleware.js";
import authMiddleware from "../middleware/auth.js";
let { get, delete:del, post, login, put } = userContr
let {tokenChecker}=userMiddleware
const router = Router();

router.get("/",tokenChecker, get); 
router.post("/", post); 
router.put("/",authMiddleware, put); 
router.post("/", login); 
router.delete("/",authMiddleware, del); 

export default router