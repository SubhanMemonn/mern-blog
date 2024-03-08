import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const useUploadPost = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const uploadPost = async ({ title, content, post, category }) => {
        if (typeof post === undefined) {
            post = ""
        }
        setLoading(true)
        try {
            const { data } = await axios.post("/api/posts/create", { title, content, post, category }, { headers: { "Content-Type": "multipart/form-data" } })
            if (data.success === true) {
                toast.success(data.message)
                navigate(`/post/${data.data.slug}`)
            }
        } catch (error) {
            // console.log(error);
            toast.error("Failed to upload")
        } finally {
            setLoading(false)
        }
    }
    return { loading, uploadPost }
}

export default useUploadPost