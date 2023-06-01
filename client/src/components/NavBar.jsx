//Navagation bar
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link  } from 'react-router-dom';
import {setMode, setLogout } from '../states/index';
import { 
  AppBar, 
  Box, 
  Typography, 
  Toolbar, 
  Avatar, 
  IconButton,
  Button, 
  useScrollTrigger, 
  Slide, 
  useTheme, 
  MenuItem,
  Autocomplete,
  TextField,
  useMediaQuery
} from '@mui/material';
import {PlayArrow, AutoStories, Logout, Settings, Person, LightMode, Nightlight } from "@mui/icons-material";
import PopupState, {bindHover, bindMenu} from "material-ui-popup-state";
import HoverMenu from 'material-ui-popup-state/HoverMenu'
import axios from 'axios';

export default function NavBar() {
  const [users, setUsers] = useState([]); //Hold searched users
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const trigger = useScrollTrigger();

  const mobileScreen = useMediaQuery("(min-width: 320px)");
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1040px)");


  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const primaryMain = theme.palette.primary.main

  async function handleChange(search){
    await axios.get(
      `http://localhost:5000/users/`,
      {params: {"search": search},
      headers: {"Content-Type": "application/json", 'Accept': 'application/json',}},
    ).then(res =>{
      //console.log(res.data);
      setUsers(res.data);
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
    console.log(err);
    })
  }

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar sx={{backgroundColor: dark}}>
            <Typography
              color="primary"
              fontWeight="bold" 
              fontSize="clamp(.5rem, 1.5rem, 2rem)"
              onClick={() => navigate("/")}
              sx={{
                display: desktopScreen ? "inherit" : "none",
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            > 
              myAnimeLibrary
            </Typography>

            <Box 
              display="inline-flex"  
              justifyContent="center"  
              alignItems="center" 
              width="100%" 
              sx={{
                "& > a": { 
                  padding:"18px 16px", 
                  textDecoration:"none", 
                  color: primaryMain,
                  fontWeight:"bold",
                  fontSize:"16px",
                  "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                  },
                },
                margin: "0 auto",
                //padding: "0 0 0 200px"
              }}
            > 
              
                {user && (
                  <>
                  <Typography component={Link} onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}} >Anime List</Typography>
                  <Typography component={Link} onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}} >Manga List</Typography>
                  </>
                )}
                
                <PopupState variant="popper" popupId="demoPopover">
                    {(popupState) => ( 
                      <>
                        <Typography 
                          component={Link} 
                          {...bindHover(popupState)} 
                          onClick={() => {
                            navigate("/search/anime"); 
                            navigate(0);
                          }}>
                            Browse
                          </Typography>
                        <HoverMenu {...bindMenu(popupState)} sx={{"& .MuiPaper-root": {width:"175px", padding:"10px"}}}>
                          <Box display="flex" alignItems="center" flexDirection="column">
                            <Box display="flex" alignItems="center">
                              <MenuItem><Typography onClick={() => {navigate("/search/anime"); navigate(0);}} display="flex" ><PlayArrow /></Typography></MenuItem>
                              <MenuItem ><Typography fontWeight="bold" sx={{textDecoration:"none", color:"inherit"}} fontSize="16px" onClick={() => {navigate("/search/anime"); navigate(0);}}>Anime</Typography></MenuItem>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <MenuItem><Typography onClick={() => {navigate("/search/manga"); navigate(0);}} display="flex" ><AutoStories /></Typography></MenuItem>
                              <MenuItem ><Typography fontWeight="bold" sx={{textDecoration:"none", color:"inherit"}} fontSize="16px" onClick={() => {navigate("/search/manga"); navigate(0);}}>Manga</Typography></MenuItem>
                            </Box>
                          </Box>
                        </HoverMenu>
                      </>
                    )}
                  </PopupState>
              </Box>
                {/* <Button variant="contained">
                  <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                </Button> */}
      
            <Autocomplete 
                    freeSolo 
                    options={users || []}
                    getOptionLabel={(option) => option.userName}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Avatar src={`http://localhost:5000/assets/${option.picturePath}`}/>&nbsp;{option.userName}
                      </Box>
                    )}
                    size='small'
                    onInputChange={(event) => {handleChange(event.target.value)}}
                    onChange={(event, option) =>{
                      window.location.href = `http://localhost:3000/user/${option.userName}`
                    }}
                    renderInput={(params) => <TextField {...params} label="Search Users" />}
                    sx={{
                      width:"250px",
                      marginRight:"1em",
                      '& .MuiAutocomplete-endAdornment':{ display: "none"},
                      '& .MuiFormLabel-root': {
                        color: "black", 
                      },
                      '& .MuiInputLabel-root.Mui-focused':{
                        color: "black",
                      },
                    }}
                  />


            {!user && (
              <Box>
                <Button variant="contained">
                    <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                  </Button> 
              </Box>
              )}
            {user && (
              <PopupState variant="popper" popupId="demoPopover">
              {(popupState) => ( 
                <>
                  <IconButton {...bindHover(popupState)}><Avatar sx={{ width: 56, height: 56 }} src={`http://localhost:5000/assets/${user.picturePath}`}/></IconButton>
                  <HoverMenu {...bindMenu(popupState)} sx={{"& .MuiPaper-root": {width:"175px", padding:"10px"}}}>
                    <MenuItem onClick={() => {navigate(`/user/${user.userName}`); navigate(0) }}><Person/>&nbsp;Profile</MenuItem>
                    <MenuItem onClick={() => {navigate('/settings'); navigate(0)}}><Settings/>&nbsp;Edit Profile</MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}><Logout/>&nbsp;Logout</MenuItem>
                  </HoverMenu>
                </>
              )}
            </PopupState>
            )}
            
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  )
}
