import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./components/homePage/HomePage";
import IndexPage from "./components/indexPage/IndexPage";
import LoginPage from "./components/loginPage/LoginPage";
import ProfilePage from "./components/profilePage/ProfilePage";
export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="user/:userId" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
