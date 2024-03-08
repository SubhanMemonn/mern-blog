import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import useGetPosts from "../hook/useGetPosts";
const Home = () => {
  const { posts } = useGetPosts({ limit: 9, page: 1 });

  return (
    <div className="w-full min-h-[100vh]">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-5xl font-semibold">Welcome to My Blog</h1>
        <p className="text-gray-500">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          className="text-teal-500 text-sm font-bold hover:underline mt-2 sm:text-sm"
          to={"/search"}
        >
          View all posts
        </Link>
      </div>
      <div className=" hover:bg-amber-100 dark:hover:bg-slate-700 mb-20 max-w-6xl mx-auto">
        <CallToAction />
      </div>
      <div className="mx-auto flex flex-col gap-20 mb-6">
        <h1 className=" text-3xl font-semibold text-center">Recent Posts</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {posts &&
            posts.post?.length > 0 &&
            posts?.post.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        <Link
          to={"/search"}
          className="text-lg text-teal-500 hover:underline text-center"
        >
          View all posts
        </Link>
      </div>
    </div>
  );
};

export default Home;
