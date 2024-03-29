import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSiteTheme, setLogout } from '../states/index';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Avatar,
  Autocomplete,
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogContent,
  Fade,
  Grow,
  IconButton,
  InputAdornment,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme 
} from '@mui/material';

import {
  AutoStories,
  Close,
  Home,
  LightMode,
  Login,
  Logout,
  Menu,
  Nightlight,
  Person,
  PlayArrow,
  Search,
  Settings
} from "@mui/icons-material";

import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import axios from 'axios';

export default function NavBar() {
  const [users, setUsers] = useState([]); // Users fetched based on search
  const [timeoutId, setTimeoutId] = useState(null); // ID for debounce timeout
  const [searchUser, setSearchUser] = useState(""); // Current value for the user search
  const [openMenu, setOpenMenu] = useState(false);  // Toggle for opening menu
  const [openDialog, setOpenDialog] = useState(false); // Toggle for opening dialog
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1100px)");
  const trigger = useScrollTrigger();
  const anchorRef = useRef(null);
  
  const source = axios.CancelToken.source();  // Source for axios request cancellation

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
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])


  const prevOpen = useRef(openMenu);
  useEffect(() => {
    if (prevOpen.current === true && openMenu === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = openMenu;
  }, [openMenu]);

  function handleLogOut(){
    setOpenMenu(false);
    dispatch(setLogout())
    navigate("/")
  }
  
  function handleOpenDialog(){setOpenDialog(true);}

  function handleCloseDialog(){setOpenDialog(false);}

  useEffect(()=>{
    handleCloseDialog();
  },[location])


  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  
  function debounce(func, wait) {
    return function executedFunction(...args) {
      function later(){
        setTimeoutId(null); // Clear the timeout ID
        func(...args);
      };
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(later, wait);
      setTimeoutId(id); // Store the timeout ID
    };
  }
  
  const debouncedHandleChange = debounce(async (search) => {
    try {
        const response = await axios.get('https://myanimelibrary.onrender.com/users/', {
            params: { "search": search },
            headers: { 
                "Content-Type": "application/json", 
                'Accept': 'application/json' 
            },
            cancelToken: source.token
        });
        setUsers(response.data);
    } catch (err) {
        if (axios.isCancel(err)) {
            console.log('Request canceled', err.message);
        } else {
            console.error(err.response.data);
        }
    }
  }, 300);

  // async function handleChange(search) {
  //     try {
  //         const response = await axios.get('https://myanimelibrary.onrender.com/users/', {
  //             params: { "search": search },
  //             headers: { 
  //                 "Content-Type": "application/json", 
  //                 'Accept': 'application/json' 
  //             },
  //             cancelToken: source.token
  //         });
  //         setUsers(response.data);
  //     } catch (err) {
  //         if (axios.isCancel(err)) {
  //             console.log('Request canceled', err.message);
  //         } else {
  //             // Handle error here, e.g.:
  //             console.error(err.response.data);
  //         }
  //     }
  // }

  //Drop down menu for search bar (desktop)
  const CustomPaper = (props) => {
    return (
    <Paper 
      sx={{
        backgroundColor: palette.background.default,
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
                <Typography component={Link} to={`/user/${user.userName}/animelist`}>Anime List</Typography>
                <Typography component={Link} to={`/user/${user.userName}/mangalist`}>Manga List</Typography>
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
                                  >
                                    <PlayArrow sx={{fontSize:"2rem"}}/><span>Anime Search</span>
                                  </Typography>

                                  <Box id="secondary-anime-links">
                                    <Typography 
                                      component={Link} 
                                      fontSize={".75rem"} 
                                      to={"/search/anime/trending"}
                                    > Trending
                                    </Typography>

                                    <Typography 
                                      component={Link} 
                                      to={"/search/anime/popularity"}
                                      fontSize={".75rem"} 
                                    > Popular
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box id="manga-links" sx={{marginTop:"10px", width:"100%",}}>
                                  <Typography 
                                    to={"/search/manga"}
                                    component={Link} 
                                  >
                                    <AutoStories sx={{fontSize:"2rem"}}/><span>Manga Search</span>
                                  </Typography>

                                  <Box id="secondary-manga-links">
                                    <Typography 
                                      to={'/search/manga/trending'}
                                      component={Link} 
                                      fontSize={".75rem"} 
                                    > Trending
                                    </Typography>
                                    
                                    <Typography 
                                      to={'/search/manga/popularity'}
                                      component={Link} 
                                      fontSize={".75rem"} 
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
                        size='small'
                        autoHighlight
                        inputValue={searchUser}
                        options={users || []}
                        getOptionLabel={(option) => option.userName || ''}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Avatar sx={{marginRight: "1rem"}} src={`${option.picturePath}`}/>&nbsp;{option.userName}
                          </Box>
                        )}
                        onInputChange={(event, newInputValue) => {
                          debouncedHandleChange(newInputValue);
                          setSearchUser(newInputValue);
                        }}
                        onChange={(event, option) =>{
                          if(option && option.userName) {
                            navigate(`/user/${option.userName}`);
                          }
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
                      /> 
                      
                      : 

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
                      <Avatar sx={{ width: 56, height: 56 }} src={`${user.picturePath}`}/>
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
                                    <MenuItem component={Link} to={`/`}><Home/><span>Home</span></MenuItem>}
                                    <MenuItem component={Link} to={`/user/${user.userName}`}><Person/><span>Profile</span></MenuItem>
                                    <MenuItem component={Link} to={'/settings'}><Settings/><span>Edit Profile</span></MenuItem>
                                    {!tabletScreen && (
                                      <>
                                        <MenuItem onClick={handleOpenDialog}><Search /><span>Search</span></MenuItem>
                                        {palette.mode === "dark" ? 
                                        <MenuItem onClick={() => dispatch(setSiteTheme())}><LightMode/><span>Light Mode</span></MenuItem>
                                        :
                                        <MenuItem onClick={() => dispatch(setSiteTheme())}><Nightlight/><span>Dark Mode</span></MenuItem>
                                        }
                                        <MenuItem component={Link} to={`/user/${user.userName}/animelist`}><PlayArrow/><span>Anime List</span></MenuItem>
                                        <MenuItem component={Link} to={`/user/${user.userName}/mangalist`}><AutoStories/><span>Manga List</span></MenuItem>
                                      </>
                                    )}
                                    <MenuItem onClick={handleLogOut}><Logout/><span>Logout</span></MenuItem>
                                  </>
                                  :
                                  <>
                                    {!desktopScreen && 
                                    <MenuItem component={Link} to={'/'}><Home/><span>Home</span></MenuItem>}
                                    <MenuItem component={Link} to={'/auth'}><Login/><span>Login</span></MenuItem>
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
                size='small'
                autoHighlight
                options={users || []}
                getOptionLabel={(option) => option.userName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar sx={{marginRight: "1rem"}} src={`${option.picturePath}`}/>&nbsp;{option.userName}
                  </Box>
                )}
                inputValue={searchUser}
                onInputChange={(event, newInputValue) => {
                  debouncedHandleChange(newInputValue);
                  setSearchUser(newInputValue);
                }}
                onChange={(event, option) =>{
                  if(option && option.userName) {
                    navigate(`/user/${option.userName}`);
                  }
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
