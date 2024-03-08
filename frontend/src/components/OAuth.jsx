import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleHandle = async () => {
    let provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const { user } = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        "/api/users/google",
        {
          name: user.displayName,
          email: user.email,
          googlePhotoUrl: user.photoURL,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success === true) {
        dispatch(signInSuccess(data.data.user));
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone={"pinkToOrange"}
      onClick={googleHandle}
    >
      <AiFillGoogleCircle className="mr-2 w-6 h-6" /> Continue with Goggle
    </Button>
  );
};

export default OAuth;
