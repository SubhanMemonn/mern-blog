import axios from "axios"
import { useState } from "react"
import { signOutSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"


const useSignOut = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const signOut = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/users/signout")
            // console.log(data);
            if (data.success === true) {
                dispatch(signOutSuccess())
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return { loading, signOut }
}

export default useSignOut