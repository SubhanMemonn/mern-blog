import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
// import { useParams } from 'react-router-dom'

const useGetPosts = ({ sort = "asc", userId, searchTerm, slug, postId, page, limit, category }) => {
    // const {postSlug}=useParams()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    let api = `/api/posts/getposts?sort=${sort}`
    if (userId) api += `&userId=${userId}`;
    if (postId) api += `&postId=${postId}`;
    if (slug) api += `&slug=${slug}`;
    if (page) api += `&page=${page}`;
    if (searchTerm) api += `&searchTerm=${searchTerm}`;
    if (limit) api += `&limit=${limit}`
    if (category) api += `&category=${category}`
    useEffect(() => {
        const posts = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(api)
                // console.log(data);
                if (data.success === true) {
                    setPosts(data.data)

                }

            } catch (error) {
                if (error.message) {

                    toast.error("Failed to fetched")
                }
            } finally {
                setLoading(false)
            }
        }
        posts()
    }, [sort, slug, userId, postId, searchTerm, page, category])
    return { loading, posts }
}

export default useGetPosts