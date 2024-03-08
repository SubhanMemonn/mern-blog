import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    updateStart,
    updateSuccess,
    updateFailure,
} from "../redux/user/userSlice"
import toast from "react-hot-toast"

const useUpdateUser = () => {
    const { currentUser } = useSelector((store) => store.user)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const updateUser = async (formData) => {

        console.log(formData);
        setLoading(true)
        dispatch(updateStart())
        try {

            const { data } = await axios.patch(`/api/users/update/${currentUser?._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
            // console.log(data);
            if (data.success === true) {
                dispatch(updateSuccess(data.data))
                toast.success(data.message)
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
        } finally {
            setLoading(false)
        }
    }


    return { loading, updateUser }
}

export default useUpdateUser
