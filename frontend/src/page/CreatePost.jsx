import { Button, Select, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import useUploadPost from "../hook/useUploadPost";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("uncategory");
  const [content, setContent] = useState("");
  const [post, setPost] = useState();
  const { loading, uploadPost } = useUploadPost();
  const submitHandle = async (e) => {
    e.preventDefault();
    await uploadPost({ category, title, post, content });
  };
  // console.log(category);
  const inputRef = useRef();
  return (
    <div className=" max-w-3xl mx-auto min-h-screen p-3 ">
      <h1 className="text-center font-semibold text-3xl my-7">Create Post</h1>
      <form onSubmit={submitHandle} className="flex flex-col gap-4">
        <div className="flex sm:flex-row flex-col justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            value={title}
            className="flex-1"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={"uncategory"}>Select a category</option>
            <option value={"javaScript"}>JavaScript</option>
            <option value="nextjs">Next.js</option>
            <option value={"reactjs"}>React.js</option>
            <option value={"nodejs"}>Node.js</option>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row">
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            onChange={(e) => setPost(e.target.files[0])}
            hidden
          />
          <Button
            gradientDuoTone={"purpleToPink"}
            className="flex-1 font-semibold"
            onClick={() => inputRef.current.click()}
          >
            Add Image
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          required
          value={content}
          className="h-72 mb-12"
          onChange={(e) => setContent(e)}
          placeholder="Write Something about your blog...."
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToPink"}
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
