//Navagation bar
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link  } from 'react-router-dom';
import {setSiteTheme, setLogout } from '../states/index';
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
import {Search, Menu, PlayArrow, AutoStories, Logout, Settings, Person, LightMode, Nightlight, Home, Close } from "@mui/icons-material";
import PopupState, {bindHover, bindMenu} from "material-ui-popup-state";
import HoverMenu from 'material-ui-popup-state/HoverMenu'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import axios from 'axios';

export default function NavBar() {
  const [users, setUsers] = useState([]); //Hold searched users
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const trigger = useScrollTrigger();

  const mobileScreen = useMediaQuery("(min-width: 320px)");
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1100px)");


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
        <AppBar sx={{backgroundColor: alt}}>
          <Toolbar >
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
              justifyContent= {desktopScreen ? "center" : "flex-start"}  
              alignItems="center" 
              width="100%" 
              sx={{
                "& > a": { 
                  padding:"15px 16px", 
                  textDecoration:"none", 
                  color: primaryMain,
                  fontWeight:"bold",
                  fontSize:"20px",
                  whiteSpace:"nowrap",
                  "&:hover": {
                    color: primaryLight,
                    cursor: "pointer",
                  },
                },
                margin: "0 auto",
                paddingLeft: desktopScreen ? "150px" : null
              }}
            > 
              
                {user && tabletScreen && (
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
                


              <Box 
                sx={{
                  display:"flex",
                  alignItems:"center",
                  gap:"1rem",
                }}
              >
                  
                {tabletScreen && 
                  <>
                    <IconButton onClick={() => dispatch(setSiteTheme())}>
                      {theme.palette.mode === "dark" ? (
                        <Nightlight sx={{ fontSize: "25px" }} />
                      ) : (
                        <LightMode sx={{ color: dark, fontSize: "25px" }} />
                      )}
                    </IconButton>
                    
                    {desktopScreen ?
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
                          width:"200px",
                          '& .MuiAutocomplete-endAdornment':{ display: "none"},
                          '& .MuiFormLabel-root': {
                            color: "black", 
                          },
                          '& .MuiInputLabel-root.Mui-focused':{
                            color: "black",
                          },
                        }}
                      /> : 
                      <IconButton>
                        <Search sx={{ color: dark, fontSize: "25px" }}/>
                      </IconButton>
                    }
                  </>
                }

{/* <Typography component={Link} onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}} >Anime List</Typography>
                  <Typography component={Link} onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}} >Manga List</Typography>
                  </> */}

                {user ? 
                  <PopupState variant="popover" popupId="profilePopper">
                    {(popupState) => ( 
                      <>
                        <IconButton {...bindHover(popupState)}><Avatar sx={{ width: 56, height: 56 }} src={`http://localhost:5000/assets/${user.picturePath}`}/></IconButton>
                        <HoverMenu {...bindMenu(popupState)} 
                          sx={{"& .MuiPaper-root": {width:"210px", padding:"10px"}}}
                        >
                          {!desktopScreen && <MenuItem onClick={() => {navigate(`/`); navigate(0);}}><Home/>&nbsp;Home</MenuItem>}
                          <MenuItem onClick={() => {navigate(`/user/${user.userName}`); navigate(0) }}><Person/>&nbsp;Profile</MenuItem>
                          <MenuItem onClick={() => {navigate('/settings'); navigate(0)}}><Settings/>&nbsp;Edit Profile</MenuItem>


                          {/* <MenuItem>
                            <IconButton onClick={() => dispatch(setSiteTheme())}>
                              {theme.palette.mode === "dark" ? (
                                <><Nightlight sx={{ fontSize: "25px" }}/><span>Night Mode</span> </>
                              ) : (
                                <><LightMode sx={{ color: dark, fontSize: "25px" }}/><span>Light Mode</span></>
                              )}
                            </IconButton>
                          </MenuItem> */}
                          {!tabletScreen && (
                            <>
                              <MenuItem><Search/>&nbsp;Search</MenuItem>
                              {theme.palette.mode === "dark" ? 
                                <MenuItem onClick={() => dispatch(setSiteTheme())}><IconButton><LightMode sx={{ color: dark }}/></IconButton>Light Mode</MenuItem>
                                :
                                <MenuItem onClick={() => dispatch(setSiteTheme())}><IconButton><Nightlight sx={{ color: dark }}/></IconButton>Dark Mode</MenuItem>
                              }
                              <MenuItem onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}}><PlayArrow/>&nbsp;Anime List</MenuItem>
                              <MenuItem onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}}><AutoStories/>&nbsp;Manga List</MenuItem>
                            </>
                          )}
                          <MenuItem onClick={() => dispatch(setLogout())}><Logout/>&nbsp;Logout</MenuItem>
                          {!tabletScreen && <MenuItem><Close/></MenuItem>}
                        </HoverMenu>
                      </>
                    )}
                  </PopupState>
                : <>
                    {!tabletScreen ? 
                    <IconButton><Menu sx={{ color: primaryMain, width: 42, height: 42 }} /></IconButton> 
                    :
                    <Box>
                      <Button variant="contained">
                          <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                      </Button> 
                    </Box>
                    }
                  </>
                }          
              </Box>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  )
}
