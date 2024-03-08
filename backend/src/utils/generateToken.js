import ApiError from "./apiError.js"
import User from "../models/user.model.js"
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const token = user.generateToken();
        return token;
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while generating Token")
    }
}

export default generateToken;