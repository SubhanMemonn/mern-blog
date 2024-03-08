import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useComment from '../zustand/useComment';
const useDeleteComment = () => {
    const [loading, setLoading] = useState(false)
    const { comments, setComments } = useComment()

    const deleteComment = async (commentId) => {
        setLoading(true);
        try {
            const { data } = await axios.delete(`/api/comments/${commentId}`)
            // console.log(data);
            if (data.success === true) {
                setComments(comments.filter((comment) => comment._id !== commentId));
                toast.success(data.message)
            }
        } catch (error) {
            // console.log(error);
            toast.error("failed to delete")

        } finally {
            setLoading(true)
        }
    }
    return { loading, deleteComment }
}

export default useDeleteComment