import Router from "express";
import JWTVerify from "../middlewares/auth.middleware.js"
import {
    createComment,
    getPostComments,
    updateComment,
    likeComment,
    deleteComment,
    getAllComments,
} from "../controllers/comment.controller.js"

const router = Router();

router.use(JWTVerify)

router.get("/all-comments", getAllComments)

router.get("/:postId", getPostComments)

router.post("/create", createComment)


router.route("/:commentId")
    .patch(updateComment)
    .delete(deleteComment)

router.put("/like/:commentId", likeComment)





export default router;