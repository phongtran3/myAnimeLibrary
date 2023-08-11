import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { themeSettings } from "./theme";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { setLogout } from "./states/index";
import { Snackbar, Alert } from "@mui/material";
import jwtDecode from "jwt-decode";

import ProfilePage from "./pages/profilePage/ProfilePage";
import LoginPage from "./pages/loginPage/LoginPage";
import IndexPage from "./pages/indexPage/IndexPage";
import SearchPage from "./pages/searchPage/SearchPage";
import ListPage from "./pages/listPage/ListPage";
import SettingPage from "./pages/settingPage/SettingPage";

export default function App() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Check if the token is expired
        dispatch(setLogout());
        setOpen(true);
      }
    }
  }, [dispatch, token]);

  useEffect(() => {
    document.title = "myAnimeLibrary";
  }, []);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <div className="app">
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="info">
          Your session has expired. Please log in again.
        </Alert>
      </Snackbar>

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
            <Route
              path="user/:userName"
              element={<ProfilePage key={window.location.pathname} />}
            />
            <Route path="user/:userName/:list" element={<ListPage />} />
            <Route
              path="/search/:media/:sort?/:page?"
              element={<SearchPage />}
            />
            {/* <Route path="user/:userName/animelist" element={<ProfilePage />} /> */}
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}
