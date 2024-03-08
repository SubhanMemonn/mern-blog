import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"


const useUpdatePost = () => {
    const { currentUser } = useSelector((store) => store.user)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { postId } = useParams()
    const updatePost = async (formData) => {
        // console.log(formData);
        setLoading(true)
        try {
            const { data } = await axios.patch(`/api/posts/${postId}/${currentUser?._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
            if (data.success === true) {
                toast.success(data.message)
                navigate(`/post/${data.data.slug}`)
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update")
        } finally {
            setLoading(false)
        }
    }
    return { loading, updatePost }
}

export default useUpdatePost