import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hook/useSignup";
import { useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, Signup } = useSignup();
  const { error } = useSelector((store) => store.user);

  const submitHandle = async (e) => {
    e.preventDefault();
    await Signup(username, email, password);
  };
  return (
    <div className="m-h-screen mt-20">
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
            This is a My project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-3" onSubmit={submitHandle}>
            <div>
              <Label value="Username" />
              <TextInput
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
                  <Spinner size={"sm"} />{" "}
                  <span className=" ml-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="gap-2 flex mt-5">
            <span>Have an account?</span>
            <Link className="text-blue-500" to={"/signin"}>
              Sign in
            </Link>
          </div>
          {error && (
            <Alert className="mt-5" color={"failure"}>
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
