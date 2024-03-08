import { useEffect, useState } from "react"

import axios from "axios"
import useComment from '../zustand/useComment'
const useGetPostComments = (postId) => {
    // console.log(postId);
    const { comments, setComments } = useComment()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getPostComments = async () => {
            // setComments([])
            setLoading(true)
            try {
                const { data } = await axios.get(`/api/comments/${postId}`)
                // console.log(data);
                if (data.success === true) {
                    setComments(data.data)
                    // toast.success(data.message)
                }
            } catch (error) {
                // setComments([])
                console.log(error);
                // toast.error("No Comment")
            } finally {
                setLoading(false)
            }
        }
        getPostComments()
    }, [postId, setComments])
    return { comments, setComments, loading }
}

export default useGetPostComments