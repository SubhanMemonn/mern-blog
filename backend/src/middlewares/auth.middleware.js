import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import User from "../models/user.model.js"
import Jwt from "jsonwebtoken"
const JWTVerify = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unathorized request")
        }
        const decoded = Jwt.verify(token, process.env.TOKEN_SECRET)
        // console.log(decoded);
        const user = await User.findById(decoded?.id)
        if (!user) {
            throw new ApiError(404, "Invalid token")
        }
        req.user = user
        next();
    } catch (error) {
        throw new ApiError("401", error?.message || "Invalid ID")
    }
})
export default JWTVerify;