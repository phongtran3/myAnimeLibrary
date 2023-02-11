import React from "react";
import IndexPage from "../src/scenes/indexPage";
import HomePage from "../src/scenes/homePage";
import LoginPage from "../src/scenes/loginPage";
import ProfilePage from "../src/scenes/profilePage";
//import NavBar from "../src/scenes/navBar";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

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
