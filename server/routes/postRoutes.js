import { upload } from "../configs/multer.js"
import { addPost, getFeedPosts, likePost } from "../controllers/postController.js"
import { protect } from "../middleware/auth.js"
import express from 'express'

const postRouter=express.Router()

postRouter.post('/add',upload.array('images',4),protect,addPost)
postRouter.get('/feed',protect,getFeedPosts)
postRouter.post('/like',protect,likePost)

export default postRouter