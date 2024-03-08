import { Button, Modal, Textarea } from "flowbite-react";
import moment from "moment";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import useDeleteComment from "../hook/useDeleteComment";
import useGetUser from "../hook/useGetUser";
import useUpdateComment from "../hook/useUpdateComment";
import { server } from "../redux/user/userSlice";
const Comment = ({ comment, onLike, likeLoading }) => {
  const { loading: editLoa, updateComment } = useUpdateComment();
  const { loading: delLoa, deleteComment } = useDeleteComment();
  const { currentUser } = useSelector((store) => store.user);
  const { user, loading } = useGetUser(comment.userId);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const editHandle = async (commentId) => {
    await updateComment({ commentId, comment: editedContent });
    setIsEditing(false);
  };
  const deleteHandle = async (commentId) => {
    await deleteComment(commentId);
  };
  return (
    <div
      className={`flex ${
        !loading && "dark:border-b-gray-600 border-b p-4"
      } text-sm`}
    >
      {loading ? (
        <div
          role="status"
          className="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700 mx-auto"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>

          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        typeof user !== "undefined" && (
          <>
            {" "}
            <div className=" flex-shrink-0 mr-3">
              <img
                className="w-10 h-10 object-cover rounded-full"
                src={
                  user.profilePicture?.startsWith("https://")
                    ? user?.profilePicture
                    : `${server}${user?.profilePicture}`
                }
                alt={user.username}
              />
            </div>
            <div className=" flex-1">
              <div className="flex items-center mb-1">
                <span className="font-bold mr-1 text-xs truncate">
                  {user ? `@${user.username}` : `anonymous user`}
                </span>

                <span className="text-gray-500 text-xs">
                  {" "}
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>

              {isEditing ? (
                <>
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    disabled={editLoa}
                  />
                  <div className="flex justify-end mt-3 gap-2 text-xs">
                    <Button
                      disabled={editLoa}
                      type="button"
                      size="sm"
                      gradientDuoTone="purpleToBlue"
                      outline
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={editLoa}
                      type="button"
                      size="sm"
                      gradientDuoTone={"purpleToBlue"}
                      onClick={() => editHandle(comment._id)}
                    >
                      Save
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-500 pb-2">{comment.content}</p>
                  <div className="dark:border-t-gray-600 border-t max-w-fit flex pt-2 items-center gap-2">
                    <button
                      onClick={() => onLike(comment?._id)}
                      type="button"
                      className={`text-gray-400 hover:text-blue-500 ${
                        currentUser &&
                        comment.likes?.includes(currentUser?._id) &&
                        "!text-blue-500"
                      }`}
                      disabled={likeLoading}
                    >
                      <FaThumbsUp className="text-sm" />
                    </button>
                    <p>
                      {comment.numberOfLikes > 0 &&
                        comment.numberOfLikes +
                          " " +
                          (comment.numberOfLikes === 1 ? "like" : "likes")}
                    </p>
                    {currentUser &&
                      (currentUser._id === comment.userId ||
                        currentUser.isAdmin) && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(true);
                              setEditedContent(comment.content);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowModal(true);
                              setCommentToDelete(comment._id);
                            }}
                            className="hover:text-red-500"
                            disabled={delLoa}
                          >
                            Delete
                          </button>
                        </>
                      )}
                  </div>
                </>
              )}
            </div>
          </>
        )
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => deleteHandle(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Comment;
