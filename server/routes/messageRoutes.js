
import express from "express";
import { getChatMessage, sendMessage, sseController } from "../controllers/messageController.js";
import { upload } from "../configs/multer.js";
import { protect } from "../middleware/auth.js";


const messageRouter=express.Router()

messageRouter.get('/:userId',sseController)
messageRouter.post('/send',upload.single('image'),protect,sendMessage);
messageRouter.post('/get',protect,getChatMessage)

export default messageRouter