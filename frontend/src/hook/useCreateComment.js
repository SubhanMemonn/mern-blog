import { useState } from "react"

import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import axios from "axios"
import useComment from "../zustand/useComment"

const useCreateComment = () => {
    const { currentUser } = useSelector((store) => store.user)
    const { comments, setComments } = useComment()
    const [loading, setLoading] = useState(false)
    const createComment = async ({ postId, comment }) => {
        setLoading(true)
        try {
            const { data } = await axios.post(`/api/comments/create`, { postId, userId: currentUser?._id, content: comment }, { headers: { "Content-Type": "application/json" } })
            if (data.success === true) {
                setComments([{ userId: currentUser._id, content: comment }, ...comments]);
                toast.success(data.message)
            }
        } catch (error) {
            toast.error("Failed to upload")
        } finally {
            setLoading(false)
        }
    }
    return { loading, createComment }
}

export default useCreateComment