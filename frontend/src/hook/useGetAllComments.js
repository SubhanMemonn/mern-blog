import { useEffect, useState } from "react"

import toast from "react-hot-toast"
import axios from "axios"
import { useSelector } from "react-redux"

const useGetAllComments = ({ page, limit }) => {
    // console.log(postId);
    const { currentUser } = useSelector((store) => store.user)
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getAllComments = async () => {

            setLoading(true)
            try {
                const { data } = await axios.get(`/api/comments/all-comments/?page=${page}&limit=${limit}`)
                // console.log(data);
                if (data.success === true) {
                    setComments(data.data)
                    toast.success(data.message)
                }
            } catch (error) {
                setComments([])
                toast.error("Failed to upload")
            } finally {
                setLoading(false)
            }
        }
        if (currentUser?.isAdmin) getAllComments();
    }, [currentUser?._id, page])
    return { loading, comments }
}

export default useGetAllComments