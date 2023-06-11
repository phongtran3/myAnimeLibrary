//Navagation bar
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {setSiteTheme, setLogout } from '../states/index';
import { 
  AppBar, Box, Typography, Toolbar, Avatar, IconButton, Button, useScrollTrigger, Slide, MenuList, Popper,
  useTheme, MenuItem, Autocomplete, TextField, useMediaQuery, Paper, Fade, Grow, ClickAwayListener, Link,
  Dialog, DialogContent, InputAdornment
} from '@mui/material';
import {Search, Menu, PlayArrow, AutoStories, Logout, Login, Settings, Person, LightMode, Nightlight, Home, Close } from "@mui/icons-material";
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import axios from 'axios';

export default function NavBar() {
  const [users, setUsers] = useState([]); //Hold searched users
  const [openMenu, setOpenMenu] = useState(false) ;
  const [openDialog, setOpenDialog] = useState(false);

  //const mobileScreen = useMediaQuery("(min-width: 320px)");
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1100px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const trigger = useScrollTrigger();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primaryMain = theme.palette.primary.main

  const anchorRef = useRef(null);
  function handleOpenMenu(){
    setOpenMenu((prevOpen) => !prevOpen);
  };

  function handleCloseMenu(event){
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenMenu(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenMenu(false);
    } else if (event.key === 'Escape') {
      setOpenMenu(false);
    }
  }

  function handleResize(){
    if(user)
      return
    if (desktopScreen && openMenu) {
      setOpenMenu(false);
    } 
  }

  useEffect(()=>{
    console.log("useEffect");
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  })

  const prevOpen = useRef(openMenu);
  useEffect(() => {
    if (prevOpen.current === true && openMenu === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openMenu;
  }, [openMenu]);


  function handleLogOut(){
    console.log("Logging Out");
    setOpenMenu(false);
    dispatch(setLogout())
    //navigate(0)
  }
  
  function handleOpenDialog(){
    setOpenDialog(true);
  }

  function handleCloseDialog(){
    setOpenDialog(false);
  }

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


  const CustomPaper = (props) => {
    return (
    <Paper 
      sx={{
        backgroundColor: background,
        "& li:hover":{
          backgroundColor: '#673ab7',
        }
      }}
      elevation={8} 
      {...props} 
     />
    )
  };

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar sx={{backgroundColor: '#9575CD'}}>
          <Toolbar >
            <Typography
              color="#111111"
              fontWeight="bold" 
              fontSize="clamp(.5rem, 1.5rem, 2rem)"
              onClick={() => navigate("/")}
              sx={{
                display: desktopScreen ? "inherit" : "none",
                "&:hover": {
                  color: '#673ab7',
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
                  color: '#111111',
                  fontWeight:"bold",
                  fontSize:"20px",
                  whiteSpace:"nowrap",
                  "&:hover": {
                    color: '#673ab7',
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
                

              {/* BROWSE MENU */}
              <PopupState variant="popper" popupId="browsePopper" >
                  {(popupState) => ( 
                      <Typography 
                        component={Link} 
                        {...bindHover(popupState)} 
                        // onClick={() => {
                        //   navigate("/search/anime"); 
                        //   navigate(0);
                        // }}
                      >
                        Browse
                      <Popper 
                        {...bindPopper(popupState)} 
                        transition 
                        placement="bottom-start" 
                        sx={{
                          width:'100%', 
                          width:"250px", 
                          marginTop:"5px", 
                          zIndex:"1101"
                        }}
                      >
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps}>
                            <Paper 
                              sx={{
                                backgroundColor: '#d1c4e9',
                                padding: "10px"
                              }}
                            >
                              <Box id="menu=wrapper"
                                sx={{
                                  display:"flex",
                                  alignItems:"center",
                                  flexDirection:"column",
                                  padding:"10px",
                                  "& a": {
                                    color: '#111111',
                                    textDecoration:"none",
                                    "&:hover": {
                                      color: '#673ab7',
                                      cursor: "pointer",
                                    }
                                  },
                                  //Secondary link div
                                  "& div > div":{
                                    gap:"1.4rem",
                                    display: "flex",
                                    justifyContent:"flex-end",
                                    alignItems:"center",
                                  },
                                  "& > div > a:first-of-type":{
                                    fontSize:"1.2rem",
                                    fontWeight:"600",
                                    display:"flex",
                                    justifyContent:"space-around",
                                    alignItems:"center",
                                  }
                                }}
                              >
                                {/* <Typography >The content of the Popper.</Typography> */}
                                <Box id="anime-links" sx={{width:"100%",}} >
                                  <Link 
                                    onClick={() => {
                                      navigate("/search/anime"); 
                                      navigate(0);
                                    }}
                                  >
                                    <PlayArrow sx={{fontSize:"2rem"}}/><span>Anime Search</span>
                                  </Link>
                                  <Box id="secondary-anime-links">
                                    <Link fontSize={".9rem"} 
                                      onClick={() => {
                                        navigate('/search/anime/trending'); 
                                        navigate(0);
                                      }} 
                                    > Trending
                                    </Link>
                                    <Link 
                                      fontSize={".9rem"} 
                                      onClick={() => {
                                        navigate('/search/anime/popularity'); 
                                        navigate(0);
                                      }} 
                                    > Popular
                                    </Link>
                                  </Box>
                                </Box>

                                <Box id="manga-links" sx={{marginTop:"10px", width:"100%",}}>
                                  <Link 
                                    onClick={() => {
                                      navigate("/search/manga"); 
                                      navigate(0);
                                    }}
                                  >
                                    <AutoStories sx={{fontSize:"2rem"}}/><span>Manga Search</span>
                                  </Link>
                                  <Box id="secondary-manga-links">
                                    <Link fontSize={".9rem"} 
                                      onClick={() => {
                                        navigate('/search/manga/trending'); 
                                        navigate(0);
                                      }} 
                                    > Trending
                                    </Link>
                                    <Link fontSize={".9rem"} 
                                      onClick={() => {
                                        navigate('/search/manga/popularity'); 
                                        navigate(0);
                                      }} 
                                    > Popular
                                    </Link>
                                  </Box>
                                </Box>
                              </Box>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </Typography>
                  )}
                </PopupState>
              </Box>
              
              {/* RIGHT SIDE USER MENU WRAP */}
              <Box 
                id="user-wrap"
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
                        <Nightlight sx={{color: '#111111', fontSize: "30px" }} />
                      ) : (
                        <LightMode sx={{ color: '#111111', fontSize: "30px" }} />
                      )}
                    </IconButton>
                    
                    {desktopScreen ?
                      // SEARCH BAR
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
                        renderInput={(params) => <TextField variant="outlined" {...params} label="Search Users..." />}
                        PaperComponent={CustomPaper}
                        sx={{
                          width:"200px",
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: '#111111'
                          },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: '#673ab7'
                          },
                          '& .MuiAutocomplete-endAdornment':{ display: "none"},
                          '& .MuiFormLabel-root, .MuiInputBase-root, .MuiInputLabel-root.Mui-focused,': {
                            color: '#111111', 
                          },                       
                        }}
                        
                      /> : 
                      <IconButton onClick={handleOpenDialog}>
                        <Search sx={{color: '#111111', fontSize: "30px" }}/>
                      </IconButton>
                    }
                  </>
                }

                {/*User's Avatar or Login/Menu Button */}
                <Box id="iconMenu">
                  <>
                  {user ? 
                    <IconButton
                      ref={anchorRef}
                      onClick={handleOpenMenu}
                      id="composition-button"
                      aria-controls={openMenu ? 'composition-menu' : undefined}
                      aria-expanded={openMenu ? 'true' : undefined}
                      aria-haspopup="true"
                    >
                      <Avatar sx={{ width: 56, height: 56 }} src={`http://localhost:5000/assets/${user.picturePath}`}/>
                    </IconButton>
                  :
                    <>
                        <IconButton
                          ref={anchorRef}
                          onClick={handleOpenMenu}
                          sx={{display: !desktopScreen ? "block" : "none"}}
                          id="composition-button"
                          aria-controls={openMenu ? 'composition-menu' : undefined}
                          aria-expanded={openMenu ? 'true' : undefined}
                          aria-haspopup="true"
                        >
                          <Menu sx={{ color: '#111111', width: 42, height: 42 }}/>
                        </IconButton> 
                        <Box>
                          <Button 
                            sx={{
                              display: desktopScreen ? "block" : "none",
                              "&:hover": {
                                backgroundColor: '#b39ddb',
                              },
                            }} 
                            onClick={() => navigate('/auth')}
                            variant="contained"
                          >
                            <Typography fontWeight="bold" fontSize="16px" sx={{ color:'#111111' }}>Login</Typography>
                          </Button> 
                        </Box>
                    </>
                  }
                  
                  {/* ICON DROPDOWN MENU */}
                  {anchorRef && 
                  <Popper
                    anchorEl={anchorRef.current} 
                    open={openMenu}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                      >
                        <Paper sx={{backgroundColor: '#d1c4e9', color: '#111111'}}>
                          <ClickAwayListener onClickAway={handleCloseMenu}>
                            <MenuList
                              autoFocusItem={openMenu}
                              id="composition-menu"
                              aria-labelledby="composition-button"
                              onKeyDown={handleListKeyDown}
                            >
                              <Box id="menu-grid"
                                sx={{
                                  display: desktopScreen || (tabletScreen && !user) ? "block" : "grid",
                                  gridTemplateColumns: "repeat(3,1fr)",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  "& .MuiButtonBase-root":{
                                    flexDirection: desktopScreen || (tabletScreen && !user) ? "row" : "column",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    fontSize: "2rem"
                                  },
                                  "span:first-of-type": {
                                    paddingTop: desktopScreen || (tabletScreen && !user) ? "0px" : "8px",
                                    paddingLeft: desktopScreen || (tabletScreen && !user) ? "10px" : "0px"
                                  }
                                  
                                }}
                              >
                                {user ? 
                                  <>
                                    {!desktopScreen && <MenuItem onClick={() => {navigate(`/`); navigate(0);}}><Home/><span>Home</span></MenuItem>}
                                    <MenuItem onClick={() => {navigate(`/user/${user.userName}`); navigate(0) }}><Person/><span>Profile</span></MenuItem>
                                    <MenuItem onClick={() => {navigate('/settings'); navigate(0)}}><Settings/><span>Edit Profile</span></MenuItem>
                                    {!tabletScreen && (
                                      <>
                                        <MenuItem><Search onClick={handleOpenDialog}/><span>Search</span></MenuItem>
                                        {theme.palette.mode === "dark" ? 
                                        <MenuItem onClick={() => dispatch(setSiteTheme())}><LightMode/><span>Light Mode</span></MenuItem>
                                        :
                                        <MenuItem onClick={() => dispatch(setSiteTheme())}><Nightlight/><span>Dark Mode</span></MenuItem>
                                        }
                                        <MenuItem onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}}><PlayArrow/><span>Anime List</span></MenuItem>
                                        <MenuItem onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}}><AutoStories/><span>Manga List</span></MenuItem>
                                      </>
                                    )}
                                    <MenuItem onClick={handleLogOut}><Logout/><span>Logout</span></MenuItem>
                                  </>
                                  :
                                  <>
                                    {!desktopScreen && <MenuItem onClick={() => {navigate(`/`); navigate(0);}}><Home/><span>Home</span></MenuItem>}
                                    <MenuItem onClick={() => {navigate('/auth');}}><Login/><span>Login</span></MenuItem>
                                    {!tabletScreen && (
                                      <>
                                      <MenuItem onClick={handleOpenDialog}><Search /><span>Search</span></MenuItem>
                                      {theme.palette.mode === "dark" ? 
                                      <MenuItem onClick={() => dispatch(setSiteTheme())}><LightMode /><span>Light Mode</span></MenuItem>
                                      :
                                      <MenuItem onClick={() => dispatch(setSiteTheme())}><Nightlight /><span>Dark Mode</span></MenuItem>
                                      }
                                      </>
                                    )}
                                  </>
                                }
                                <MenuItem onClick={handleCloseMenu}><Close/><span>Close</span></MenuItem>

                              </Box>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>}
                  </>
                </Box>
              </Box>
          </Toolbar>
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            fullWidth={true} 
            maxWidth={"sm"} 
            PaperProps={{
              sx: {
                position:"absolute",
                top:"10%"
              }
            }}
          >
            <DialogContent sx={{backgroundColor: "#E0E0E0"}}>
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
                renderInput={(params) => 
                  <TextField 
                    variant="outlined"  
                    {...params} 
                    label="Search Users..." 
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{color: '#111111', fontSize: "20px" }}/>
                        </InputAdornment>
                      )
                    }}
                  />}
                sx={{
                  width:"100%",
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#111111'
                  },
                  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#673ab7'
                  },
                  '& .MuiAutocomplete-endAdornment':{ display: "none"},
                  '& .MuiFormLabel-root': {
                    color: '#111111', 
                  },
                  '& .MuiInputLabel-root.Mui-focused':{
                    color: '#111111',
                  },
                }}
              />
            </DialogContent>
          </Dialog>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  )
}
