import { rm } from "fs";
import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
// import { faker } from "@faker-js/faker"

const create = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;
    const post = req.file;
    if (!req.user?.isAdmin) {
        throw new ApiError(403, "You are not allowed to create a post")
    }

    if (!title || !content) {
        throw new ApiError(400, "Please provide all required fields")
    }

    const slug = title.split(" ").join("-").replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

    const newPost = await Post.create({
        userId: req.user?._id,
        content,
        title,
        post: post?.path,
        category,
        slug,
    })

    return res.status(200)
        .json(new ApiResponse(200, newPost, "Post Created"))
})

const getPosts = asyncHandler(async (req, res) => {
    const { userId, category, slug, postId, searchTerm } = req.query;
    const today = new Date()
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 9;
    const skip = limit * (page - 1)
    const sort = req.query.sort === "asc" ? 1 : -1;

    let baseQuery = {}

    if (userId) {
        baseQuery.userId = userId;
    }
    if (category) {
        baseQuery.category = category;
    }
    if (slug) {
        baseQuery.slug = slug
    }
    if (postId) {
        baseQuery._id = postId
    }
    if (searchTerm) {
        baseQuery["$or"] = [
            { title: { $regex: searchTerm, $options: "i" } },
            { content: { $regex: searchTerm, $options: "i" } }
        ]
    }
    const post = await Post.find(baseQuery).sort({ createdAt: sort }).limit(limit).skip(skip)

    const totalPost = await Post.countDocuments();

    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())

    const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } })

    return res.status(200)
        .json(new ApiResponse(200, { post, totalPost, lastMonthPosts }))

})

const updatePost = asyncHandler(async (req, res) => {
    const { postId, userId } = req.params;
    const { title, content, category, } = req.body;
    const post = req.file;
    if (!req.user?.isAdmin && req.user?._id !== userId) {
        throw new ApiError(403, 'You are not allowed to update this post');
    }

    const findPost = await Post.findById(postId);
    if (!findPost) {
        throw new ApiError(404, "Post not found")
    }

    if (!title || !content) {

        throw new ApiError(404, 'All fields are required');
    }
    if (post) {
        rm(findPost.post, () => {
            console.log("Post Deleted");
        })
    }
    const slug = title.split(" ").join("-").replace(/[^a-zA-Z)-9-]/g, "").toLowerCase()
    const update = await Post.findByIdAndUpdate(findPost._id, {
        $set: {
            title,
            content,
            category,
            slug,
            post: post?.path
        }
    }, { new: true })
    if (!update) {
        throw new ApiError(500, "Something went wrong while updated post")
    }
    return res.status(200)
        .json(new ApiResponse(200, update, "Post Updated"))
})

const deletePost = asyncHandler(async (req, res) => {
    const { postId, userId } = req.params;

    if (!req.user?.isAdmin || req.user?._id != userId) {
        throw new ApiError(403, 'You are not allowed to update this post');
    }
    const findPost = await Post.findById(postId)
    if (!findPost) {
        throw new ApiError(404, "Post not found")
    }
    const deleted = await findPost.deleteOne();
    if (!deletePost) {
        throw new ApiError(500, "Something went wrong while delete post")
    }

    return res.status(200)
        .json(new ApiResponse(200, {}, "Deleted successfully"))
})
// const generateRandomProducts = async (count = 10) => {
//     const users = [];

//     for (let i = 0; i < count; i++) {
//         const user = {
//             _id: faker.string.uuid(),
//             userId: "65d14cbc4adf68284b36bb7e",
//             title: "hello",
//             content: faker.lorem.paragraph(),
//             post: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
//             slug: faker.lorem.lines().split(" ").join("-").toLowerCase(),
//             category: "uncategorized",
//             createdAt: new Date(faker.date.past()),
//             updatedAt: new Date(faker.date.recent()),
//             __v: 0,
//         };

//         users.push(user);
//     }
//     await Post.create(users);

//     console.log("done");
// }
// generateRandomProducts(40)
export {
    create, deletePost, getPosts,
    updatePost
};
