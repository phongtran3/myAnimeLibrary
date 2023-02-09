import React from "react";
const { BrowserRouter, Navigate, Routes, Route } = require("react-router-dom");
const HomePage = require("../src/scenes/homePage");
const LoginPage = require("../src/scenes/login");
const ProfilePage = require("../src/scenes/profilePage");
const IndexPage = require("../src/scenes/indexPage");
//const NavBar = require("../src/scenes/navBar");

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="user/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
