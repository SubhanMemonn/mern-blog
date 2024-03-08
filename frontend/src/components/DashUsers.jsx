import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { MdOutlineBlock } from "react-icons/md";
import { useSelector } from "react-redux";
import useDeleteUser from "../hook/useDeleteUser";
import useGetUsers from "../hook/useGetUsers";
import { server } from "../redux/user/userSlice";
const DashUsers = () => {
  const { currentUser } = useSelector((store) => store.user);
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(true);
  const { loading, users } = useGetUsers({ page, limit: 9 });
  const [user, setUser] = useState({});
  const [deleteUserId, setDeleteUserId] = useState("");

  const { deleteUser, loading: deleteLoading } = useDeleteUser();
  const deleteHandle = async (userId) => {
    const updatedUserArr = user.filter((i) => i._id !== userId);
    setUser(updatedUserArr);

    await deleteUser(userId);
  };
  useEffect(() => {
    const fetch = () => {
      if (users?.user) {
        if (page > 1 && users.user[0]?._id) {
          // setUser([...user, ...users.user]);
          setUser((prev) => [...prev, ...users.user]);
        } else if (page === 1) {
          setUser(users.user);
        }
      }
      if (
        typeof users.user === "object" &&
        Object.keys(users?.user)?.length < 9
      ) {
        setShowMore(false);
      }
    };
    fetch();
  }, [users]);

  return (
    <div className="w-full overflow-hidden table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <center>
          <Spinner className="w-[20%] h-screen" />
        </center>
      ) : currentUser.isAdmin &&
        typeof user === "object" &&
        Object.keys(user)?.length > 0 ? (
        <>
          <Table hoverable className=" shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Update</Table.HeadCell>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>admin</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {user.map((i) => (
                <Table.Row
                  key={i._id}
                  className=" bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(i.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      className=" w-14 h-10 md:w-12 md:h-11 bg-gray-500 rounded-full overflow-hidden object-cover"
                      src={
                        i.profilePicture.startsWith("https://")
                          ? i.profilePicture
                          : `${server}${i.profilePicture}`
                      }
                      alt={i.username}
                    />
                  </Table.Cell>
                  <Table.Cell>@{i.username}</Table.Cell>
                  <Table.Cell>{i.email}</Table.Cell>
                  <Table.Cell>
                    {i.isAdmin ? (
                      <FaCheck className=" text-green-800 text-xl" />
                    ) : (
                      <FaTimes className=" text-red-600 text-xl" />
                    )}
                  </Table.Cell>
                  <Table.Cell
                    onClick={() => {
                      setDeleteUserId(i._id);
                      deleteHandle(i._id);
                    }}
                  >
                    <button
                      disabled={i.isAdmin}
                      className=" text-red-600 hover:underline"
                    >
                      {deleteLoading && deleteUserId == i._id ? (
                        <Spinner />
                      ) : i.isAdmin ? (
                        <MdOutlineBlock className=" text-xl" />
                      ) : (
                        "Delete"
                      )}
                    </button>{" "}
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
        "No User yet!"
      )}
    </div>
  );
};

export default DashUsers;
