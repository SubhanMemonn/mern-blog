import Router from "express";
import JWTVerify from "../middlewares/auth.middleware.js"
import { singleUpload } from "../middlewares/multer.middleware.js"
import {
    signup,
    signin,
    signout,
    google,
    updateUser,
    deleteUser,
    getAllUsers,
    getUser
} from "../controllers/users.controller.js"

const router = Router();


router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signout", signout)
router.post("/google", google)

// secure Routes

router.get("/all-users", JWTVerify, getAllUsers)
router.get("/:userId", JWTVerify, getUser)
router.patch("/update/:userId", JWTVerify, singleUpload, updateUser)
router.delete("/delete/:userId", JWTVerify, deleteUser)




export default router;