import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FooterCom from "./components/Footer";
import Header from "./components/Header";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import PrivateRoute from "./components/PrivateRoute";
import About from "./page/About";
import CreatePost from "./page/CreatePost";
import Home from "./page/Home";
import PostPage from "./page/PostPage";
import Search from "./page/Search";
import SignIn from "./page/SignIn";
import SignUp from "./page/SignUp";
import UpdatePost from "./page/UpdatePost";
// import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./page/Dashboard";
const App = () => {
  return (
    <div className="min-h-screen">
      <Router>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
        </Routes>
        <FooterCom />
        <Toaster />
      </Router>
    </div>
  );
};

export default App;
