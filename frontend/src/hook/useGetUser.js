import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


const useGetUser = (userId) => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const userFetched = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`/api/users/${userId}`)
                // console.log(data);
                if (data.success === true) {
                    setUser(data.data)
                    // console.log(data.data);
                }
            } catch (error) {
                toast.error("Error")
            } finally {
                setLoading(false)
            }
        }
        userFetched()
    }, [userId])
    return { user, loading }
}

export default useGetUser