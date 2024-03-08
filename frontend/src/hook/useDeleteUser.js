import axios from 'axios'
import {
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure
} from "../redux/user/userSlice"
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const useDeleteUser = () => {
    const { currentUser } = useSelector((store) => store.user)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const deleteUser = async (userId) => {
        dispatch(deleteUserStart())
        setLoading(true)
        console.log(userId);
        try {
            const { data } = await axios.delete(`/api/users/delete/${userId}`)
            if (data.success === true) {
                if (data.data === currentUser?._id) {
                    dispatch(deleteUserSuccess())

                }
                toast.success(data.message)
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        } finally {
            setLoading(false)
        }
    }
    return { loading, deleteUser }
}

export default useDeleteUser