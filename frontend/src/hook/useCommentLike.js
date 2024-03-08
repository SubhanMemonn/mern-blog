import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useComment from "../zustand/useComment";

const useCommentLike = () => {
    const { comments, setComments } = useComment();
    const [loading, setLoading] = useState(false)
    const like = async (commentId) => {
        // console.log(commentId);
        setLoading(true)
        try {
            const { data } = await axios.put(`/api/comments/like/${commentId}`)
            console.log(data);
            if (data.success === true) {
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId
                            ? {
                                ...comment,
                                likes: data.data.like.likes,
                                numberOfLikes: data.data.like.likes.length,
                            }
                            : comment
                    )
                );

                toast.success(data.message)
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.message)

        } finally {
            setLoading(false)
        }
    }
    return { loading, like, comments }
}

export default useCommentLike