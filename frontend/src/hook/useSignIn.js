import axios from "axios"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signUpFailure } from "../redux/user/userSlice.js"
import { useState } from "react";
const useSignIn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const SignIn = async (email, password) => {
        if (!email || !password) {
            toast.error("Email or password are required");
        }
        dispatch(signUpFailure(null))
        dispatch(signInStart())
        setLoading(true)
        try {
            const { data } = await axios.post("/api/users/signin", { email, password }, { headers: { "Content-Type": "application/json" } })
            // console.log(data);
            if (data.data) {
                dispatch(signInSuccess(data.data.user))
                navigate('/');
            }
            toast.success(data.message)
        } catch (error) {
            dispatch(signUpFailure(error.message))
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }
    return { SignIn, loading }

}

export default useSignIn;