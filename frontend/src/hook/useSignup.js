import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { signUpFailure, signUpStart, signUpSuccess } from "../redux/user/userSlice";
const useSignup = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const Signup = async (username, email, password) => {
        if (!username || !email || !password) {
            toast.error("All Field are required")

        }
        dispatch(signUpStart())

        setLoading(true)
        try {
            const { data } = await axios.post("/api/users/signup", { username, email, password }, { headers: { "Content-Type": "application/json" } })
            // console.log(data);
            if (data.success === true) {
                dispatch(signUpSuccess(data.data.user))
                navigate('/');
                toast.success(data.message)
            } else {

                toast.error(data.message)
            }
        } catch (error) {
            dispatch(signUpFailure(error.message))
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }
    return { loading, Signup }

}

export default useSignup;