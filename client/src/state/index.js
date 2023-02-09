import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  animes: [], //List of animes
  mangas: [], //List of mangas
};

//Auth workflow
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSiteTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});
