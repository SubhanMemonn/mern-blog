import React from "react";
import { Link } from "react-router-dom";
import { server } from "../redux/user/userSlice";

const PostCard = ({ post }) => {
  // console.log(post.post);
  return (
    <div className=" group relative border border-teal-500 hover:p-4 hover:border-4 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all p-2 bottom-2">
      <Link to={`/post/${post.slug}`}>
        <img
          className="h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20"
          src={`${server}${post.post}`}
          alt={post.slug}
        />
      </Link>
      <div className="flex flex-col gap-2 p-3 text-lg line-clamp-2">
        <p className=" font-semibold">{post.title}</p>
        <span className=" text-sm italic">{post.category}</span>
        <Link
          className=" absolute group-hover:bottom-2 right-0 left-0 text-center border border-teal-500 rounded-xl !rounded-tl-none m-2 z-10 py-2 bottom-[-200px] transition-all duration-300 hover:bg-teal-500 hover:text-white text-teal-500"
          to={`/post/${post.slug}`}
        >
          Read article
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
