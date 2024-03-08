import { Button, Spinner, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useCommentLike from "../hook/useCommentLike";
import useCreateComment from "../hook/useCreateComment";
import useGetPostComments from "../hook/useGetPostComments";
import { server } from "../redux/user/userSlice";
import Comment from "./Comment";
import useUpdateComment from "../hook/useUpdateComment";

const CommentSection = ({ postId }) => {
  // console.log(postId);
  const { comments, setComments } = useGetPostComments(postId);
  const { createComment, loading } = useCreateComment();
  // console.log(comments);
  const { like, loading: likeloa, comments: commentLike } = useCommentLike();

  const { currentUser } = useSelector((store) => store.user);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    await createComment({ postId, comment });
    setComment("");
  };
  const onLike = async (commentId) => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    await like(commentId);
  };

  // console.log(commentLike);
  return (
    <div className=" max-w-2xl mx-auto w-full p-3 ">
      {currentUser ? (
        <div className="flex items-center gap-1 text-sm my-5 text-gray-500">
          <p>Signed in as:</p>
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={
              currentUser.profilePicture.startsWith("https://")
                ? currentUser.profilePicture
                : ` ${server}${currentUser.profilePicture}`
            }
            alt={currentUser.username}
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-cyan-600 hover:underline text-xs"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1 items-center">
          You must be signed in to comment
          <Link to={"/signin"} className="text-cyan-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={submitHandler}>
          <Textarea
            placeholder="Add a comment....."
            rows={"4"}
            maxLength={"200"}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between my-5 items-center">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button
              type="submit"
              gradientDuoTone={"purpleToBlue"}
              outline
              disabled={loading}
            >
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </div>
        </form>
      )}
      {comments.length > 0 ? (
        <div className="text-sm my-5 flex items-center gap-1">
          <p>Comments</p>
          <div className="border border-gray-400 py-1 px-2 rounded-sm">
            <p>{comments.length}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm my-5">No comments yet!</p>
      )}
      {comments.length > 0 &&
        comments?.map((i) => (
          <Comment
            comment={i}
            key={i.createdAt}
            onLike={onLike}
            likeLoading={likeloa}
          />
        ))}
    </div>
  );
};

export default CommentSection;
