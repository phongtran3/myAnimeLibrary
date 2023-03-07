//Navagation bar
import React from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link  } from 'react-router-dom';
import {setMode, setLogout } from '../states/index';
import { 
  AppBar, 
  Box, 
  Typography, 
  Toolbar, 
  Avatar, 
  Button, 
  useScrollTrigger, 
  Slide, 
  useTheme, 
  HideOnScroll, 
  DarkMode, 
  LightMode,
  Menu,
  MenuItem
} from '@mui/material';
import {PlayArrow, AutoStories} from "@mui/icons-material";


import PopupState, {bindPopover, bindHover, bindToggle, bindPopper, bindMenu} from "material-ui-popup-state";
import HoverMenu from 'material-ui-popup-state/HoverMenu'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const user = useSelector((state) => state.user);
  //const { userName } = useSelector((state) => state.user);
  const trigger = useScrollTrigger();


  return (
    <div>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar sx={{margin:"0 50px"}}>
            <Typography fontWeight="bold" fontSize="16px" component={Link} to="/">MyAnimeLibrary</Typography>
            <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" 
              sx={{"& > a": { padding:"0 12px", textDecoration:"none", color:"inherit"}, "button:last-child": {color:"red"}}}
            > 
              {user && (
                <>
                <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${user.userName}`} >Profile</Typography>
                <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${user.userName}/animelist`} >Anime List</Typography>
                <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${user.userName}/mangalist`} >Manga List</Typography>
                </>
              )}
              <PopupState variant="popper" popupId="demoPopover">
                  {(popupState) => ( 
                    <>
                      <Typography fontWeight="bold" fontSize="16px" {...bindToggle(popupState)} component={Link} to="/search/anime" >Browse</Typography>
                      <HoverMenu {...bindMenu(popupState)} sx={{width:"150px", padding:"20px"}}>
                        <Box display="flex" alignItems="center">
                          <Typography component={Link} to="/search/anime" display="flex" ><PlayArrow /></Typography >
                          <MenuItem onClick={popupState.close}><Typography fontWeight="bold" sx={{textDecoration:"none", color:"inherit"}} fontSize="16px" component={Link} to="/search/anime">Anime</Typography></MenuItem>
                        </Box>
                        <Box>
                          <MenuItem onClick={popupState.close}><Typography fontWeight="bold" sx={{textDecoration:"none", color:"inherit"}} fontSize="16px" component={Link} to="/search/manga">Manga</Typography></MenuItem>
                        </Box>
                      </HoverMenu  >
                    </>
                  )}
                </PopupState>
                {/* <Button variant="contained">
                  <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                </Button> */}
            </Box>
            <Box>
               <Button variant="contained">
                  <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                </Button> 
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </div>
  )
}
