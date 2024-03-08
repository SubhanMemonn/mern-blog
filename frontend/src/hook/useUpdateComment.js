import { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import useComment from '../zustand/useComment';
const useUpdateComment = () => {
    const [loading, setLoading] = useState(false)
    const { comments, setComments } = useComment();

    const updateComment = async ({ commentId, comment }) => {
        setLoading(true);
        try {
            const { data } = await axios.patch(`/api/comments/${commentId}`, { content: comment }, { headers: { "Content-Type": "application/json" } })
            if (data.success === true) {
                setComments(
                    comments.map((c) =>
                        c._id === commentId
                            ? {
                                ...c,
                                content: comment,
                            }
                            : c
                    )
                );
                // setComment(data.data)
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        } finally {
            setLoading(true)
        }
    }
    return { loading, updateComment }
}

export default useUpdateComment