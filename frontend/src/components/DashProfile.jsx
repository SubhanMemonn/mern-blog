import { Button, Spinner, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useDeleteUser from "../hook/useDeleteUser";
import useSignOut from "../hook/useSignOut";
import useUpdateUser from "../hook/useUpdateUser";
import { server } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
const DashProfile = () => {
  const { currentUser } = useSelector((store) => store.user);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const { loading, deleteUser } = useDeleteUser();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { signOut } = useSignOut();
  const [profile, setProfile] = useState("");
  // console.log(profilePicture);

  const deleteUserHandle = async () => {
    await deleteUser(currentUser?._id);
  };

  const changeImageHandler = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProfile(reader.result);
          setFormData({ ...formData, ["post"]: file });
        }
      };
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log(profile);
  const signoutHandle = async () => {
    await signOut();
  };
  const updateHandle = async (e) => {
    e.preventDefault();

    console.log({ ...formData });

    await updateUser(formData);
  };

  return (
    <div className=" max-w-lg w-full mx-auto p-3">
      <h1 className=" text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={updateHandle} className="flex flex-col gap-4">
        <input
          type="file"
          ref={filePickerRef}
          hidden
          onChange={changeImageHandler}
        />
        <div className="w-32 h-32 rounded-full shadow-lg cursor-pointer overflow-hidden mx-auto my-3">
          <img
            src={
              profile
                ? profile
                : currentUser.profilePicture.startsWith("https://")
                ? currentUser.profilePicture
                : ` ${server}${currentUser.profilePicture}`
            }
            alt="User"
            onClick={() => filePickerRef.current.click()}
            className=" w-full h-full object-cover rounded-full"
          />
        </div>
        <TextInput
          id="username"
          defaultValue={currentUser.username}
          onChange={onChange}
        />
        <TextInput
          id="email"
          defaultValue={currentUser.email}
          onChange={onChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Enter Password"
          onChange={onChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={updateLoading}
        >
          {updateLoading ? <Spinner size={"sm"} className="mr-3" /> : "Update"}
        </Button>
        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone={"purpleToBlue"}
              className="w-full"
            >
              Create Post
            </Button>
          </Link>
        )}
      </form>
      <div className="mt-5 flex justify-between text-red-500 ">
        {loading ? (
          <Spinner size={"sm"} />
        ) : (
          <span className="cursor-pointer" onClick={deleteUserHandle}>
            {" "}
            Delete Account
          </span>
        )}
        <span className="cursor-pointer" onClick={signoutHandle}>
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default DashProfile;
