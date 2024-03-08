import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useDeleteComment from "../hook/useDeleteComment";
import useGetAllComments from "../hook/useGetAllComments";
const DashComments = () => {
  const { currentUser } = useSelector((store) => store.user);
  const [page, setPage] = useState(1);
  const { comments, loading } = useGetAllComments({ page, limit: 9 });
  const [showMore, setShowMore] = useState(true);
  const [comment, setComment] = useState({});
  const [deleteCommentId, setDeleteCommentId] = useState("");
  const { deleteComment, loading: deleteLoading } = useDeleteComment();
  const deleteHandle = async (commentId) => {
    const updatedUserArr = comment.filter((i) => i._id !== commentId);

    await deleteComment(commentId);
    if (deleteComment) {
      setComment(updatedUserArr);
    }
  };
  useEffect(() => {
    const fetch = () => {
      if (comments?.comment) {
        if (page > 1 && comments?.comment[0]?._id) {
          // setComment([...user, ...users.user]);
          setComment((prev) => [...prev, ...comments.comment]);
        } else if (page === 1) {
          setComment(comments?.comment);
        }
      }
      if (
        typeof comments?.comment === "object" &&
        Object.keys(comments?.comment)?.length < 9
      ) {
        setShowMore(false);
      }
    };
    fetch();
  }, [comments]);

  return (
    <div className="w-full overflow-hidden table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading && typeof comments === "undefined" ? (
        <center>
          <Spinner className="w-[20%] h-screen" />
        </center>
      ) : currentUser.isAdmin &&
        typeof comment === "object" &&
        Object.keys(comment)?.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Update</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>number of likes</Table.HeadCell>
              <Table.HeadCell>postid</Table.HeadCell>
              <Table.HeadCell>userid</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comment.map((i) => (
                <Table.Row
                  key={i._id}
                  className=" bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(i.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{i.content}</Table.Cell>
                  <Table.Cell>{i.numberOfLikes}</Table.Cell>
                  <Table.Cell>{i.postId}</Table.Cell>
                  <Table.Cell>{i.userId}</Table.Cell>
                  <Table.Cell
                    onClick={() => {
                      setDeleteCommentId(i._id);
                      deleteHandle(i._id);
                    }}
                  >
                    <button className=" text-red-600 hover:underline">
                      {deleteLoading && deleteCommentId == i._id ? (
                        <Spinner />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={() => setPage(page + 1)}
              className="text-teal-500 font-bold  text-sm py-7 self-center w-full"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-2xl font-semibold text-slate-500">
          No Comment yet!
        </p>
      )}
    </div>
  );
};

export default DashComments;
