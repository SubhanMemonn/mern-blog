import { Button, Select, Spinner, TextInput, Textarea } from "flowbite-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetPosts from "../hook/useGetPosts";
import useUpdatePost from "../hook/useUpdatePost";
import { server } from "../redux/user/userSlice";
const UpdatePost = () => {
  const [postShow, setPostShow] = useState("");
  const [post, setPost] = useState("");
  const [formData, setFormData] = useState({});
  const { loading: updateLoading, updatePost } = useUpdatePost();
  const { postId } = useParams();
  const { posts, loading } = useGetPosts({ postId });
  const inputRef = useRef();

  const changeImageHandler = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPostShow(reader.result);
          setFormData({ ...formData, ["post"]: file });
        }
      };
    }
  };
  useEffect(() => {
    if (posts?.post) {
      setPost(posts.post[0].post);
      setFormData({
        ...formData,
        title: posts.post[0].title,
        category: posts.post[0].category,
        content: posts.post[0].content,
      });
    }
  }, [posts, loading]);
  const submitHandle = async (e) => {
    e.preventDefault();
    // console.log(formData);
    await updatePost(formData);
  };
  return (
    <div className=" max-w-3xl mx-auto min-h-screen p-3 w-full">
      <h1 className="text-center font-semibold text-3xl my-7">Update Post</h1>
      {loading ? (
        <center>
          <Spinner className=" w-[30%] h-screen" />
        </center>
      ) : (
        <form onSubmit={submitHandle} className="flex flex-col gap-4">
          <div className="flex sm:flex-row flex-col justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              value={formData.title}
              className="flex-1"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ["title"]: e.target.value }))
              }
            />
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ["category"]: e.target.value,
                }))
              }
            >
              <option value={"uncategory"}>Select a category</option>
              <option value={"javaScript"}>JavaScript</option>
              <option value="nextjs">Next.js</option>
              <option value={"reactjs"}>React.js</option>
              <option value={"nodejs"}>Node.js</option>
            </Select>
          </div>
          <div className="flex flex-col">
            <input
              type="file"
              ref={inputRef}
              accept="image/*"
              onChange={changeImageHandler}
              hidden
            />
            <Button
              gradientDuoTone={"purpleToPink"}
              className="flex-1 font-semibold"
              onClick={() => inputRef.current.click()}
            >
              Add Image
            </Button>
            <div className=" self-center my-2 max-h-[20rem] overflow-y-scroll scrollbar scrollbar-track-slate-100  scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
              {
                <img
                  className="w-full h-full object-contain"
                  src={postShow ? postShow : `${server}${post}`}
                  alt={formData.title}
                />
              }
            </div>
          </div>
          <ReactQuill
            className="h-72 mb-12"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, ["content"]: e }))
            }
            placeholder="Write Something about your blog...."
          />
          <Button
            type="submit"
            gradientDuoTone={"purpleToPink"}
            outline
            disabled={updateLoading}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default UpdatePost;
