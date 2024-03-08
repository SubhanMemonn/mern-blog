import { isValidObjectId } from "mongoose";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
    const { content, postId, userId } = req.body;
    if (!isValidObjectId(postId)) {
        throw new ApiError(404, "Invalid post id")
    }
    if (!content || content === " ") {
        throw new ApiError(400, "You cannot send empty comment")

    }

    if (req.user._id != userId) {
        throw new ApiError(403, "You are not allowed to create this comment")

    }
    const findPost = await Post.findById(postId);
    if (!findPost) {
        throw new ApiError(404, "Post not found")

    }

    const newComment = await Comment.create({
        postId,
        userId,
        content
    })

    if (!newComment) {
        throw new ApiError(500, "Something went wrong while uploading comment")
    }

    return res.status(200)
        .json(new ApiResponse(200, newComment, "Comment uploaded"))
})

const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
        throw new ApiError(404, "Invalid post id")
    }
    const findPost = await Post.findById(postId);
    if (!findPost) {
        throw new ApiError(404, "Post not found")

    }

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 })

    // if (!comments.length) {
    //     throw new ApiError("400", "No comments")
    // }
    return res.status(200)
        .json(new ApiResponse(200, comments, "Comments fetched"))



})

const likeComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    let findComment = await Comment.findById(commentId)
    if (!findComment) {
        throw new ApiError(404, "Comment not found")
    }
    const findLike = findComment.likes.indexOf(req.user?._id);
    if (findLike === -1) {
        findComment.likes.push(req.user?._id);
        findComment.numberOfLikes += 1;
        await findComment.save({ validateBeforeSave: false })

        return res.status(200)
            .json(new ApiResponse(200, { like: findComment }, "Liked successfully"))
    } else {
        findComment.likes.splice(findLike, 1);
        findComment.numberOfLikes -= 1;
        await findComment.save({ validateBeforeSave: false })

        return res.status(200)
            .json(new ApiResponse(200, { like: findComment }, "Unliked successfully"))
    }
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "You cannot send empty comment")
    }
    const findComment = await Comment.findById(commentId);
    if (!findComment) {
        throw new ApiError(404, "Comment not found")
    }
    // console.log(req.user);
    if (!req.user?.isAdmin && !findComment.userId.equals(req.user._id)) {

        throw new ApiError(403, "You have no right to update this comment")
    }

    const comment = await Comment.findByIdAndUpdate(findComment._id, {
        $set: {
            content
        }
    }, { new: true })

    return res.status(200)
        .json(new ApiResponse(200, comment, "Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const findComment = await Comment.findById(commentId);
    if (!findComment) {
        throw new ApiError(404, "Comment not found")
    }
    // console.log(findComment.userId.equals(req.user._id));
    if (!req.user?.isAdmin && !findComment.userId.equals(req.user._id)) {

        throw new ApiError(403, "You have no right to delete this comment")
    }

    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) {

        throw new ApiError(500, "Failed to delete")
    }
    return res.status(200)
        .json(new ApiResponse(200, { commentId }, "Comment Deleted"))
})

const getAllComments = asyncHandler(async (req, res) => {

    const today = new Date();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 9;
    const skip = limit * (page - 1);
    const sort = req.query.sort === "desc" ? -1 : 1;

    if (!req.user?.isAdmin) {
        throw new ApiError(403, "You are not allowed to get all comments")
    }
    const comment = await Comment.find().sort({ createdAt: sort }).limit(limit).skip(skip)

    const totalComments = await Comment.countDocuments()

    const oneMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())

    const lastMonthComment = await Comment.find({
        createdAt: { $gte: oneMonth }
    })

    return res.status(200)
        .json(new ApiResponse(200, { comment, totalComments, lastMonthComment }, "All comment fetched"))

})

export {
    createComment,
    getPostComments,
    likeComment,
    updateComment,
    deleteComment,
    getAllComments,
}