//Navagation bar
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {setSiteTheme, setLogout } from '../states/index';
import { 
  AppBar, Box, Typography, Toolbar, Avatar, IconButton, Button, useScrollTrigger, Slide, MenuList, Popper,
  useTheme, MenuItem, Autocomplete, TextField, useMediaQuery, Paper, Fade, Grow, ClickAwayListener,
  Dialog, DialogContent, InputAdornment
} from '@mui/material';
import {Search, Menu, PlayArrow, AutoStories, Logout, Login, Settings, Person, LightMode, Nightlight, Home, Close } from "@mui/icons-material";
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import axios from 'axios';
import { Link } from 'react-router-dom';

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

  const { palette } = useTheme();
  const neutralLight = palette.neutral.light;
  const dark = palette.neutral.dark;
  const background = palette.background.default;
  const primaryLight = palette.primary.light;
  const alt = palette.background.alt;
  const primaryMain = palette.primary.main

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
    //console.log("useEffect");
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
    //console.log("Logging Out");
    setOpenMenu(false);
    dispatch(setLogout())
    navigate("/")
  }
  
  function handleOpenDialog(){
    //console.log("open");
    setOpenDialog(true);
  }

  function handleCloseDialog(){
    setOpenDialog(false);
  }

  async function handleChange(search){
    await axios.get(
      `https://myanimelibrary.onrender.com/users/`,
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


  //Drop down menu for search bar (desktop)
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
        <AppBar id="header" sx={{backgroundColor: '#212121'}}>
          <Toolbar >
            <Typography
              component={Link}
              sx={{
                display: desktopScreen ? "inherit" : "none",
                "&:hover": {
                  color: '#b39ddb',
                  cursor: "pointer",
                },
                color:"#e0e0e0",
                fontWeight:"600",
                fontSize:"clamp(.5rem, 1.5rem, 2rem)",
                textDecoration:"none",
              }}
              to={"/"}
              onClick={() => navigate("/")}
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
                  color: '#e0e0e0',
                  fontWeight:"bold",
                  fontSize:"20px",
                  whiteSpace:"nowrap",
                  "&:hover": {
                    color: '#b39ddb',
                    cursor: "pointer",
                  },
                },
                margin: "0 auto",
                paddingLeft: desktopScreen ? "150px" : null
              }}
            > 
              {user && tabletScreen && (
                <>
                <Typography component={Link} to={`/user/${user.userName}/animelist`} onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}} >Anime List</Typography>
                <Typography component={Link} to={`/user/${user.userName}/mangalist`} onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}} >Manga List</Typography>
                </>
              )}
                

              {/* BROWSE MENU */}
              <PopupState variant="popper" popupId="browsePopper" >
                  {(popupState) => ( 
                    <>
                      <Typography 
                        component={Link} 
                        {...bindHover(popupState)} 
                        to={"/search/anime"}
                        onClick={() => {
                          navigate("/search/anime"); 
                          navigate(0);
                        }}
                      >
                        Browse
                      </Typography>
                      <Popper 
                        {...bindPopper(popupState)} 
                        transition 
                        placement="bottom-start" 
                        sx={{
                          zIndex:"1101"
                        }}
                      >
                        {({ TransitionProps }) => (
                          <Fade {...TransitionProps}>
                            <Paper 
                              sx={{
                                background: '#424242',
                                padding: "10px 15px"
                              }}
                            >
                              <Box id="menu=wrapper"
                                sx={{
                                  display:"flex",
                                  alignItems:"center",
                                  flexDirection:"column",
                                  "& a": {
                                    color: '#e0e0e0',
                                    textDecoration:"none",
                                    "&:hover": {
                                      color: '#b39ddb',
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
                                    gap:"1rem",
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
                                  <Typography 
                                    component={Link} 
                                    to={"/search/anime"}
                                    onClick={() => {
                                      navigate("/search/anime"); 
                                      navigate(0);
                                    }}
                                  >
                                    <PlayArrow sx={{fontSize:"2rem"}}/><span>Anime Search</span>
                                  </Typography>
                                  <Box id="secondary-anime-links">
                                    <Typography 
                                      component={Link} 
                                      fontSize={".75rem"} 
                                      to={"/search/anime/trending"}
                                      onClick={() => {
                                        navigate('/search/anime/trending'); 
                                        navigate(0);
                                      }} 
                                    > Trending
                                    </Typography>
                                    <Typography 
                                      component={Link} 
                                      to={"/search/anime/popularity"}
                                      fontSize={".75rem"} 
                                      onClick={() => {
                                        navigate('/search/anime/popularity'); 
                                        navigate(0);
                                      }} 
                                    > Popular
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box id="manga-links" sx={{marginTop:"10px", width:"100%",}}>
                                  <Typography 
                                    to={"/search/manga"}
                                    component={Link} 
                                    onClick={() => {
                                      navigate("/search/manga"); 
                                      navigate(0);
                                    }}
                                  >
                                    <AutoStories sx={{fontSize:"2rem"}}/><span>Manga Search</span>
                                  </Typography>
                                  <Box id="secondary-manga-links">
                                    <Typography 
                                      to={'/search/manga/trending'}
                                      component={Link} 
                                      fontSize={".75rem"} 
                                      onClick={() => {
                                        navigate('/search/manga/trending'); 
                                        navigate(0);
                                      }} 
                                    > Trending
                                    </Typography>
                                    <Typography 
                                      to={'/search/manga/popularity'}
                                      component={Link} 
                                      fontSize={".75rem"} 
                                      onClick={() => {
                                        navigate('/search/manga/popularity'); 
                                        navigate(0);
                                      }} 
                                    > Popular
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Paper>
                          </Fade>
                        )}
                      </Popper>
                    </>
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
                      {palette.mode === "dark" ? (
                        <Nightlight sx={{color: '#e0e0e0', fontSize: "30px" }} />
                      ) : (
                        <LightMode sx={{ color: '#e0e0e0', fontSize: "30px" }} />
                      )}
                    </IconButton>
                    
                    {desktopScreen ?
                      // SEARCH BAR
                      <Autocomplete 
                        autoHighlight
                        options={users || []}
                        getOptionLabel={(option) => option.userName}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Avatar sx={{marginRight: "1rem"}} src={`https://myanimelibrary.onrender.com/assets/${option.picturePath}`}/>&nbsp;{option.userName}
                          </Box>
                        )}
                        size='small'
                        onInputChange={(event) => {handleChange(event.target.value)}}
                        onChange={(event, option) =>{
                          navigate(`/user/${option.userName}`);
                          navigate(0);
                        }}
                        renderInput={(params) => <TextField variant="outlined" {...params} label="Search Users..." />}
                        PaperComponent={CustomPaper}
                        sx={{
                          backgroundColor:"#424242",
                          width:"200px",
                          ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0"
                          },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#e0e0e0"
                          },
                          '.MuiAutocomplete-endAdornment':{ display: "none"},
                          '.MuiFormLabel-root, .MuiInputBase-root, .MuiInputLabel-root.Mui-focused,': {
                            color: '#e0e0e0', 
                          },                       
                        }}
                        
                      /> : 
                      <IconButton onClick={handleOpenDialog}>
                        <Search sx={{color: '#e0e0e0', fontSize: "30px" }}/>
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
                      <Avatar sx={{ width: 56, height: 56 }} src={`https://myanimelibrary.onrender.com/assets/${user.picturePath}`}/>
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
                          <Menu sx={{ color: '#e0e0e0', width: 42, height: 42 }}/>
                        </IconButton> 
                        <Box>
                          <Button 
                            sx={{
                              backgroundColor:"#673ab7",
                              display: desktopScreen ? "block" : "none",
                              "&:hover": {
                                backgroundColor: '#7e57c2',
                              },
                            }} 
                            onClick={() => navigate('/auth')}
                            variant="contained"
                          >
                            <Typography fontWeight="bold" fontSize="16px" sx={{ color:'#fafafa' }}>Login</Typography>
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
                        <Paper sx={{backgroundColor: '#424242', color: '#e0e0e0'}}>
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
                                  },
                                  "& .MuiButtonBase-root:hover":{
                                    color:"#b39ddb"
                                  }
                                  
                                }}
                              >
                                {user ? 
                                  <>
                                    {!desktopScreen && 
                                    <MenuItem component={Link} to={`/`} onClick={() => {navigate(`/`); navigate(0);}}><Home/><span>Home</span></MenuItem>}
                                    <MenuItem component={Link} to={`/user/${user.userName}`} onClick={() => {navigate(`/user/${user.userName}`); navigate(0) }}><Person/><span>Profile</span></MenuItem>
                                    <MenuItem component={Link} to={'/settings'} onClick={() => {navigate('/settings'); navigate(0)}}><Settings/><span>Edit Profile</span></MenuItem>
                                    {!tabletScreen && (
                                      <>
                                        <MenuItem onClick={handleOpenDialog}><Search /><span>Search</span></MenuItem>
                                        {palette.mode === "dark" ? 
                                        <MenuItem onClick={() => dispatch(setSiteTheme())}><LightMode/><span>Light Mode</span></MenuItem>
                                        :
                                        <MenuItem onClick={() => dispatch(setSiteTheme())}><Nightlight/><span>Dark Mode</span></MenuItem>
                                        }
                                        <MenuItem component={Link} to={`/user/${user.userName}/animelist`} onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}}><PlayArrow/><span>Anime List</span></MenuItem>
                                        <MenuItem component={Link} to={`/user/${user.userName}/mangalist`} onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}}><AutoStories/><span>Manga List</span></MenuItem>
                                      </>
                                    )}
                                    <MenuItem onClick={handleLogOut}><Logout/><span>Logout</span></MenuItem>
                                  </>
                                  :
                                  <>
                                    {!desktopScreen && <MenuItem onClick={() => {navigate(`/`); navigate(0);}}><Home/><span>Home</span></MenuItem>}
                                    <MenuItem component={Link} to={'/auth'} onClick={() => {navigate('/auth');}}><Login/><span>Login</span></MenuItem>
                                    {!tabletScreen && (
                                      <>
                                      <MenuItem onClick={handleOpenDialog}><Search /><span>Search</span></MenuItem>
                                      {palette.mode === "dark" ? 
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
            <DialogContent 
              sx={{
                backgroundColor: palette.background.default
              }}
            >
              <Autocomplete 
                options={users || []}
                autoHighlight
                getOptionLabel={(option) => option.userName}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar sx={{marginRight: "1rem"}} src={`https://myanimelibrary.onrender.com/assets/${option.picturePath}`}/>&nbsp;{option.userName}
                  </Box>
                )}
                size='small'
                onInputChange={(event) => {handleChange(event.target.value)}}
                onChange={(event, option) =>{
                  navigate(`/user/${option.userName}`);
                  navigate(0);
                }}
                PaperComponent={CustomPaper}
                renderInput={(params) => 
                  <TextField 
                    variant="outlined"  
                    {...params} 
                    label="Search Users..." 
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{color: palette.neutral.dark, fontSize: "20px" }}/>
                        </InputAdornment>
                      )
                    }}
                  />}
                sx={{
                  width:"100%",
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: palette.neutral.dark,
                    borderWidth: "2px",
                  },
                  ".MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: `${palette.primary.main} !important`
                  },
                  ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":{
                    borderColor: palette.primary.dark,
                  },
                  '& .MuiAutocomplete-endAdornment':{ display: "none"},
                  '& .MuiFormLabel-root': {
                    color: palette.neutral.dark,
                  },
                  ".MuiInputLabel-root.Mui-focused":{
                    color: palette.primary.dark,
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
