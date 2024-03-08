import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../redux/user/userSlice";
import useGetPosts from "../hook/useGetPosts";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
const PostPage = () => {
  const { postSlug } = useParams();
  const { posts, loading } = useGetPosts({ slug: postSlug });
  const { posts: recentPosts, loa } = useGetPosts({ limit: 3 });
  // console.log();
  // console.log(posts);
  return (
    <div className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {loading ? (
        <center className="overflow-hidden">
          <Spinner className=" h-screen w-[20%] " />
        </center>
      ) : posts?.post ? (
        <main>
          <h1 className="text-center text-3xl font-serif max-w-2xl mx-auto lg:text-4xl mt-10 p-3 capitalize">
            {posts && posts?.post[0].title}
          </h1>
          <Link
            to={`/search?category=${posts?.post[0].category}`}
            className="mt-5 flex justify-center"
          >
            <Button pill color="gray" size={"xs"} className=" uppercase">
              {posts?.post[0].category}
            </Button>
          </Link>
          <img
            className="mt-10 p-3 max-h-[600px] w-full object-cover"
            src={
              posts?.post[0].post.startsWith("https://")
                ? posts?.post[0].post
                : `${server}${posts?.post[0].post}`
            }
            alt={posts?.post[0].title}
          />
          <div className=" flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>
              {new Date(posts?.post[0].createdAt).toLocaleDateString()}
            </span>
            <span>
              {(posts?.post[0].content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <div
            className="mt-10 post-content"
            dangerouslySetInnerHTML={{ __html: posts?.post[0].content }}
          ></div>
          <CallToAction />
          <div className="w-full my-10 flex flex-col items-center justify-center gap-16">
            <h1 className=" font-semibold text-center text-3xl">
              Recent Articles
            </h1>
            {typeof recentPosts === "undefined" && loa ? (
              <center>
                <Spinner size={"xl"} className="my-10" />
              </center>
            ) : (
              Object.keys(recentPosts)?.length > 0 && (
                <div className="flex flex-wrap gap-5 justify-center w-[90vw]">
                  {recentPosts?.post.map((i) => (
                    <PostCard key={i._id} post={i} />
                  ))}
                </div>
              )
            )}
          </div>
          <CommentSection postId={posts.post[0]._id} />
        </main>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default PostPage;
