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
    setSiteUser: (state, action) => {
      console.log(action.payload.user);
      console.log(action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setSiteTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      console.log(action.payload.user);
      console.log(action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setAnimes: (state, action) => {
      if (state.user) {
        state.user.animes = action.payload.friends;
      } else {
        console.log("User anime list non-existent");
      }
    },
    setMangas: (state, action) => {
      if (state.user) {
        state.user.mangas = action.payload.friends;
      } else {
        console.log("User manga list non-existent");
      }
    },
  },
});

export const {
  setSiteUser,
  setSiteTheme,
  setLogin,
  setLogout,
  setAnimes,
  setMangas,
} = authSlice.actions;
export default authSlice.reducer;

//Will need to update anime/manga info when user adds to list (e.g. adding anime/manga to list, will indicate it's been added)
