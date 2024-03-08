import Router from "express";
import JWTVerify from "../middlewares/auth.middleware.js"
import { singleUpload } from "../middlewares/multer.middleware.js"
import {
    create,
    getPosts,
    updatePost,
    deletePost
} from "../controllers/post.controller.js"

const router = Router();

router.post("/create", JWTVerify, singleUpload, create)

router.get("/getposts", getPosts)

router.route("/:postId/:userId").patch(JWTVerify, singleUpload, updatePost
).delete(JWTVerify, deletePost)



export default router;