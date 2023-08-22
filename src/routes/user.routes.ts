import { Router } from "express";
import userContr from "../controllers/user.contr.js";
let { get, delete:del, post, login, put } = userContr

const router = Router();

router.get("/", get); 
router.post("/", post); 
router.put("/:id", put); 
router.post("/", login); 
router.delete("/:id", del); 

export default router