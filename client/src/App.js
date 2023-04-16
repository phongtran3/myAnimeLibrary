import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { themeSettings } from "./theme";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ProfilePage from "./pages/profilePage/ProfilePage";
import LoginPage from "./pages/loginPage/LoginPage";
import IndexPage from "./pages/indexPage/IndexPage";
import HomePage from "./pages/homePage/HomePage";
import SearchPage from "./pages/searchPage/SearchPage";
import ListPage from "./pages/listPage/ListPage";
import SettingPage from "./pages/settingPage/SettingPage";

export default function App() {
  console.log("app render");
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route
              path="/settings"
              element={!user ? <Navigate to="/" /> : <SettingPage />}
            />
            <Route path="user/:userName" element={<ProfilePage />} />
            <Route path="user/:userName/:list" element={<ListPage />} />
            <Route
              path="/search/:media/:sort?/:page?"
              exact
              element={<SearchPage />}
            />

            {/* <Route path="user/:userName/animelist" element={<ProfilePage />} /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
