import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSignOut from "../hook/useSignOut";
import { toggleTheme } from "../redux/theme/themeSlice";
import { server } from "../redux/user/userSlice";
const Header = () => {
  const { currentUser } = useSelector((store) => store.user);
  const { theme } = useSelector((store) => store.theme);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, signOut } = useSignOut();
  const signOutHandle = async () => {
    await signOut();
  };
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`search?${searchQuery}`);
  };
  // console.log(searchTerm);
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className=" font-semibold text-sm sm:text-xl whitespace-nowrap dark:text-white"
      >
        <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-1 rounded-lg text-white">
          My
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="sm:inline hidden"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="flex gap-2 md:order-2">
        <Button className="sm:hidden h-10 w-12" pill color="gray">
          <AiOutlineSearch />
        </Button>
        <Button
          className="w-12 h-10"
          pill
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={
                  currentUser.profilePicture.startsWith("https://")
                    ? currentUser.profilePicture
                    : `${server}${currentUser.profilePicture}`
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={signOutHandle}>
                {loading ? <Spinner size={"sm"} /> : "Sign Out"}
              </Dropdown.Item>
            </Dropdown.Header>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
