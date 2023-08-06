import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { themeSettings } from "./theme";
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { setLogout } from "./states/index";

import jwtDecode from "jwt-decode";
import ProfilePage from "./pages/profilePage/ProfilePage";
import LoginPage from "./pages/loginPage/LoginPage";
import IndexPage from "./pages/indexPage/IndexPage";
import SearchPage from "./pages/searchPage/SearchPage";
import ListPage from "./pages/listPage/ListPage";
import SettingPage from "./pages/settingPage/SettingPage";

export default function App() {
  console.log("app render");
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Check if the token is expired
        console.log("test");
        // Perform logout operation here
        // This might involve dispatching a Redux action, for example
        // dispatch({ type: 'LOGOUT' });
        dispatch(setLogout());
        //navigate("/");
        // Redirect to login page or show a notification
      }
    }
  }, [dispatch, token]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/" element={<IndexPage />} />
            {/* <Route path="/home" element={<HomePage />} /> */}
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
