import { TextInput, Select, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useGetPosts from "../hook/useGetPosts";
import PostCard from "../components/PostCard";
const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  // console.log(sidebarData);
  const [showMore, setShowMore] = useState(false);
  const [page, setPage] = useState(1);
  const [post, setPost] = useState([]);
  const changeHandler = (e) => {
    setSidebarData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { posts, loading } = useGetPosts({
    limit: 9,
    page,
    category: sidebarData.category,
    searchTerm: sidebarData.searchTerm,
    sort: sidebarData.sort,
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (urlParams || searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
  }, [location.search]);
  useEffect(() => {
    if (posts) {
      // console.log(posts);
      if (page > 1) {
        setPost([...post, posts.post]);
      } else if (page === 1) {
        setPost(posts?.post);
      }
      if (posts.post > 8) {
        setShowMore(true);
      }
    }
  }, [posts, loading]);
  // console.log(post);
  // console.log(sidebarData);
  return (
    <div className="flex md:flex-row flex-col">
      <div className="md:min-h-screen border-b md:border-r border-gray-500 p-7">
        <form className="flex flex-col gap-8 ">
          <div className="flex items-center gap-4">
            <label className="font-semibold whitespace-nowrap ">
              Search Term:
            </label>
            <TextInput
              placeholder="Serach...."
              name="searchTerm"
              value={sidebarData.searchTerm}
              onChange={changeHandler}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold">Sort:</label>
            <Select
              value={sidebarData.sort}
              onChange={changeHandler}
              name="sort"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <label className="font-semibold">Category:</label>
            <Select
              value={sidebarData.category}
              onChange={changeHandler}
              name="category"
            >
              <option value={"uncategory"}>Select a category</option>
              <option value={"javaScript"}>JavaScript</option>
              <option value="nextjs">Next.js</option>
              <option value={"reactjs"}>React.js</option>
              <option value={"nodejs"}>Node.js</option>
            </Select>
          </div>
        </form>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h1 className=" font-semibold text-center text-4xl border-b w-full py-8 border-gray-500">
          Posts Results
        </h1>
        <div className="flex flex-wrap justify-center gap-4 p-7 min-h-screen">
          {loading && typeof post?.length === 0 ? (
            <Spinner size={"xl"} />
          ) : post?.length > 0 ? (
            post?.map((post) => <PostCard post={post} key={post._id} />)
          ) : (
            <p className="text-4xl text-gray-500 capitalize font-bold">
              No result found
            </p>
          )}
        </div>
        {showMore && (
          <button className="text-teal-500 font-semibold mb-5 hover:underline">
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
