import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"


const useDeletePost = () => {
    const [loading, setLoading] = useState(false)
    const { currentUser } = useSelector((store) => store.user)
    const deletePost = async (postId) => {
        setLoading(true)
        try {
            const { data } = await axios.delete(`/api/posts/${postId}/${currentUser?._id}`)
            if (data.success === true) {
                toast.success(data.message)

            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to Delete")
        } finally {
            setLoading(false)
        }
    }
    return { loading, deletePost }
}

export default useDeletePost