import { Router } from "express";
import userContr from "../controllers/user.contr";
let { get, delete:del, post, login, put } = userContr

const router = Router();

router.get("/", get); 
router.post("/", post); 
router.put("/", put); 
router.post("/", login); 
router.delete("/", del); 

