import { rm } from "fs";
import { isValidObjectId } from "mongoose";
import { COOKIE_OPTIONS } from "../constants.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
// import { faker } from "@faker-js/faker"
const signup = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }
    const userNameCheck = await User.findOne({ username });

    if (userNameCheck) {
        throw new ApiError(400, "Username is already exists")
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
        throw new ApiError(400, "Email is already exists")
    }
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password
    });

    const createdUser = await User.findById(user?._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Failed to signup")
    }

    const token = await generateToken(createdUser?._id)

    return res.status(200)
        .cookie("token", token, COOKIE_OPTIONS)
        .json(new ApiResponse(200, { user: createdUser, token }, "Signup successfully"))
})

const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found")

    }

    const isPasswordCorrect = await user.passwordCheck(password.toString());
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Wrong password")
    }

    const loggedinUser = await User.findById(user?._id).select("-password")

    if (!loggedinUser) {
        throw new ApiError(500, "Something went wrong while signin the user")

    }

    const token = await generateToken(loggedinUser?._id)

    return res.status(200)
        .cookie("token", token, COOKIE_OPTIONS)
        .json(new ApiResponse(200, { user: loggedinUser, token }, "Signin successfully"))
})

const signout = asyncHandler(async (req, res) => {
    return res.status(200)
        .clearCookie("token", COOKIE_OPTIONS)
        .json(new ApiResponse(200, {}, "Signout Successfully"))
})

const google = asyncHandler(async (req, res) => {
    const { email, name, googlePhotoUrl } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const token = await generateToken(user._id);
        const loggedinUser = await User.findById(user._id).select("-password")

        return res.status(200)
            .cookie("token", token, COOKIE_OPTIONS)
            .json(new ApiResponse(200, { user: loggedinUser, token }, "Signin Successfully"))
    } else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
        console.log(generatedPassword);
        const user = await User.create({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password: generatedPassword,
            profilePicture: googlePhotoUrl
        })
        const createdUser = await User.findById(user?._id).select("-password")
        if (!createdUser) {
            throw new ApiError(500, "Failed to signup")
        }
        const token = await generateToken(createdUser?._id);
        return res.status(200)
            .cookie("token", token, COOKIE_OPTIONS)
            .json(new ApiResponse(200, { user: createdUser, token }, "Signup Successfully"))
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const { password, email, username } = req.body;
    console.log(password, email, username);
    const post = req.file;

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid ID")
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found")

    }

    if (!user._id.equals(req.user?._id)) {
        throw new ApiError(403, "You are not allowed to update this user")
    }

    if (post) {
        rm(user.profilePicture, () => {
            console.log("photo deleted");
        })
        user.profilePicture = post?.path
    }
    if (password) {
        if (password.length < 6) {
            throw new ApiError(400, "Password must be at least 6 characters")
        }
        user.password = password;
    }
    if (username) {
        if (username.length > 20) {
            throw new ApiError(400, 'Username must be less than 20 characters')

        }
        if (username.includes(" ")) {
            throw new ApiError(400, 'Username cannot contain spaces');
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            throw new ApiError(400, "Username can only contain letters and numbers")
        }
        user.username = username;
    }

    if (email) user.email = email;

    await user.save({ validateBeforeSave: false })


    res.status(200)
        .json(new ApiResponse(200, user, "Updated"))
})

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!req.user?.isAdmin && req.user?._id != userId) {
        throw new ApiError(403, "You are not allowed to delete this user")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid ID")

    }
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
        throw new ApiError(500, "failed to delete")

    }

    return res.status(200)
        .json(new ApiResponse(200, { userId }, "User deleted Successfully"))
})

const getAllUsers = asyncHandler(async (req, res) => {
    const today = new Date()

    if (!req.user?.isAdmin) {
        throw new ApiError(403, "You are not allowed to see all users")
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || 9;
    const sort = req.query.sort === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const user = await User.find({}).sort({ createdAt: sort }).limit(limit).skip(skip).select("-password")

    const totalUsers = await User.countDocuments();

    const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today
    }

    const thisMonthUsers = await User.find({
        createdAt: {
            $gte: thisMonth.start,
            $lte: thisMonth.end
        }
    })

    return res.status(200)
        .json(new ApiResponse(200, { user, totalUsers, thisMonthUsers }, "All users fetched"))

})

const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "Invalid ID")
    }

    const user = await User.findById(userId).select("-password")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"))
})
// const generateRandomProducts = async (count = 10) => {
//     const users = [];

//     for (let i = 0; i < count; i++) {
//         const user = {
//             // _id: faker.string.uuid(),
//             username: faker.internet.userName(),
//             email: faker.internet.email(),
//             profilePicture: faker.image.avatar(),
//             password: faker.internet.password(),

//             category: faker.commerce.department(),
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v: 0,
//         };

//         users.push(user);
//     }
//     await User.create(users);

//     console.log("done");
// }
// generateRandomProducts(40)

export {
    deleteUser,
    getAllUsers,
    getUser, google, signin,
    signout, signup, updateUser
};

