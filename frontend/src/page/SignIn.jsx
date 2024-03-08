import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSignIn from "../hook/useSignIn";
import { useSelector } from "react-redux";
import OAuth from "../components/OAuth";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { SignIn: signInHanlde, loading } = useSignIn();
  const { error } = useSelector((state) => state.user);

  const submitHandle = async (e) => {
    e.preventDefault();

    await signInHanlde(email, password);
  };
  return (
    <div className="h-full mt-20 pb-5">
      <div className=" w-full max-w-3xl mx-auto flex flex-col sm:flex-row md:items-center gap-8 p-3 sm:p-2">
        <div className=" flex-1">
          {" "}
          <Link
            to={"/"}
            className=" font-bold text-4xl whitespace-nowrap dark:text-white"
          >
            <span className="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-1 rounded-lg text-white">
              My
            </span>
            Blog
          </Link>
          <p className=" text-sm mt-5">
            This is a My project. You can sign in with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={submitHandle}>
            <div>
              <Label value="Email" />
              <TextInput
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              gradientDuoTone={"purpleToPink"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  {" "}
                  <Spinner size={"sm"} />{" "}
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="gap-2 flex mt-5">
            <span>Don't Have an account?</span>
            <Link className="text-blue-500" to={"/signup"}>
              Sign up
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
