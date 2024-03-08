import { useEffect, useState } from "react";
import useGetUsers from "../hook/useGetUsers";
import useGetPosts from "../hook/useGetPosts";
import useGetAllComments from "../hook/useGetAllComments";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { server } from "../redux/user/userSlice";
import { Button, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
const DashboardComp = () => {
  const { users, loading: userLoading } = useGetUsers({ limit: 5, page: 1 });

  const { posts, loading: postLoading } = useGetPosts({ limit: 5 });
  const { comments, loading: commentLoading } = useGetAllComments({ limit: 5 });
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  useEffect(() => {
    if (users || posts || comments) {
      setTotalUsers(users.totalUsers);
      setTotalComments(comments.totalComments);
      setTotalPosts(posts.totalPost);
      setLastMonthComments(comments.lastMonthComment?.length);
      setLastMonthPosts(posts.lastMonthPosts);
      setLastMonthUsers(users?.thisMonthUsers?.length);
    }
  }, [users, posts, comments]);
  console.log(comments);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex justify-between p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            <h1 className="uppercase font-semibold text-gray-500">
              Total users
            </h1>
            <p className="text-3xl">{totalUsers}</p>
            <span className="mt-2 text-gray-500 flex whitespace-nowrap">
              <span className="mr-2 !text-green-500 flex items-center tracking-tighter">
                {" "}
                <HiArrowNarrowUp />
                {lastMonthUsers}
              </span>{" "}
              Last month
            </span>
          </div>
          <div className="sm:h-14 sm:w-14 w-12 h-12 flex justify-center items-center rounded-full mt-5">
            <HiOutlineUserGroup className="p-3 text-5xl text-white bg-teal-600 rounded-full shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            <h1 className="uppercase font-semibold text-gray-500">
              Total comments
            </h1>
            <p className="text-3xl">{totalComments}</p>
            <span className="mt-2 text-gray-500 flex whitespace-nowrap">
              <span className="mr-2 !text-green-500 flex items-center tracking-tighter">
                {" "}
                <HiArrowNarrowUp />
                {lastMonthComments}
              </span>{" "}
              Last month
            </span>
          </div>
          <div className="sm:h-14 sm:w-14 w-12 h-12 flex justify-center items-center rounded-full mt-5">
            <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
        <div className="flex justify-between p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex flex-col gap-2">
            <h1 className="uppercase font-semibold text-gray-500">
              Total posts
            </h1>
            <p className="text-3xl">{totalPosts}</p>
            <span className="mt-2 text-gray-500 flex whitespace-nowrap">
              <span className="mr-2 !text-green-500 flex items-center tracking-tighter">
                {" "}
                <HiArrowNarrowUp />
                {lastMonthPosts}
              </span>{" "}
              Last month
            </span>
          </div>
          <div className="sm:h-14 sm:w-14 w-12 h-12 flex justify-center items-center rounded-full mt-5">
            <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 py3 mx-auto mt-5">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <div>Recent Users</div>
            <div>
              {" "}
              <Link to={"/dashboard?tab=users"}>
                <Button gradientDuoTone={"purpleToPink"} outline>
                  See all
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>user image</Table.HeadCell>
                <Table.HeadCell>username</Table.HeadCell>
              </Table.Head>
              <Table.Body className=" divide-y">
                {!userLoading &&
                  typeof users.user === "object" &&
                  users?.user.map((user) => (
                    <Table.Row key={user._id}>
                      <Table.Cell>
                        <img
                          className="w-12 h-12 rounded-full object-cover"
                          src={
                            user.profilePicture.startsWith("https://")
                              ? user.profilePicture
                              : `${server}${user.profilePicture}`
                          }
                          alt={user.username}
                        />
                      </Table.Cell>
                      <Table.Cell>@{user.username}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold">
            <div>Recent Comments</div>
            <div>
              {" "}
              <Link to={"/dashboard?tab=comments"}>
                <Button gradientDuoTone={"purpleToPink"} outline>
                  See all
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              <Table.Body className=" divide-y">
                {commentLoading && typeof comments === "undefined" ? (
                  <center>
                    <Spinner size={"xl"} />
                  </center>
                ) : (
                  typeof comments.comment === "object" &&
                  comments?.comment.map((comment) => (
                    <Table.Row key={comment._id}>
                      <Table.Cell>{comment.content}</Table.Cell>
                      <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between items-center p-3 text-sm font-semibold h-fit">
            <div>Recent Posts</div>
            <div>
              {" "}
              <Link to={"/dashboard?tab=posts"}>
                <Button gradientDuoTone={"purpleToPink"} outline>
                  See all
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Posts image</Table.HeadCell>
                <Table.HeadCell>post title</Table.HeadCell>
              </Table.Head>
              <Table.Body className=" divide-y">
                {postLoading && typeof posts === "undefined" ? (
                  <center>
                    <Spinner size={"xl"} />
                  </center>
                ) : (
                  typeof posts.post === "object" &&
                  posts?.post.map((post) => (
                    <Table.Row key={post._id}>
                      <Table.Cell>
                        <img
                          className="w-12 h-12 object-contain"
                          src={`${server}${post.post}`}
                          alt={post.title}
                        />
                      </Table.Cell>
                      <Table.Cell>{post.title}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
