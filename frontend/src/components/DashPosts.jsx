import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useDeletePost from "../hook/useDeletePost";
import useGetPosts from "../hook/useGetPosts";
import { server } from "../redux/user/userSlice";
const DashPosts = () => {
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(true);
  const [post, setPost] = useState({});
  const { currentUser } = useSelector((store) => store.user);

  const [postIdToDelete, setPostIdToDelete] = useState("");
  const { loading, posts } = useGetPosts({ userId: currentUser._id, page });
  const { deletePost, loading: deleteLoading } = useDeletePost();
  const deleteHandle = async (postId) => {
    const updatePost = post.filter((i) => i._id !== postId);
    setPost(updatePost);

    await deletePost(postId);
  };
  useEffect(() => {
    const fetch = () => {
      if (posts) {
        // console.log(posts?.post);
        if (page > 1 && posts?.post[0]._id) {
          setPost([...post, ...posts?.post]);
        } else if (page === 1) {
          setPost(posts?.post);
        }
        if (posts?.post?.length < 9) {
          setShowMore(false);
        }
      }
    };
    fetch();
  }, [page, posts, loading]);
  // console.log(posts);
  return (
    <div className=" table-auto overflow-x-scroll md:mx-auto p3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 p-3 w-full overflow-hidden">
      {loading ? (
        <Spinner className=" w-[20%] mx-auto overflow-hidden flex justify-center mt-10 h-screen" />
      ) : currentUser.isAdmin &&
        typeof post === "object" &&
        Object.keys(post).length > 0 ? (
        <>
          <Table className="shadow-md" hoverable>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className=" divide-y">
              {post.map((i) => (
                <Table.Row
                  key={i._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(i.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${i.slug}`}>
                      <img
                        src={
                          i.post.startsWith("https://")
                            ? i.post
                            : `${server}${i.post}`
                        }
                        alt={i.title}
                        className=" w-16 h-12 object-fit bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${i.slug}`}
                      className=" font-medium text-gray-900 dark:text-white"
                    >
                      {i.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{i.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        deleteHandle(i._id);
                        setPostIdToDelete(i._id);
                      }}
                      className=" text-red-400 cursor-pointer font-medium"
                    >
                      {deleteLoading && postIdToDelete === i._id ? (
                        <Spinner />
                      ) : (
                        "Delete"
                      )}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${i._id}`}
                      className=" text-blue-400 hover:underline cursor-pointer font-medium"
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={() => setPage(page + 1)}
              className=" self-center w-full text-teal-500 text-sm py-7 font-semibold"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-2xl">You have no posts yet!</p>
      )}
    </div>
  );
};

export default DashPosts;
