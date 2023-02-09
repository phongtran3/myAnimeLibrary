import React from "react";
const { BrowserRouter, Navigate, Routes, Route } = require("react-router-dom");
const HomePage = require("../src/scenes/homePage");
// const LoginPage = require("../src/scenes/login");
const ProfilePage = require("../src/scenes/profilePage");

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="user/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
