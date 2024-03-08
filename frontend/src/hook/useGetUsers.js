import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"


const useGetUsers = ({ page, limit }) => {
    // console.log(page);
    const { currentUser } = useSelector((store) => store.user)

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`/api/users/all-users?page=${page}&limit=${limit}`)
                console.log(data.data);
                if (data.success === true) {
                    setUsers(data.data)
                    if (page === 1) {

                        toast.success(data.message)
                    }
                }
            } catch (error) {
                setUsers([])
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (currentUser?.isAdmin) getUsers();
    }, [currentUser?._id, page])
    return { loading, users }
}

export default useGetUsers