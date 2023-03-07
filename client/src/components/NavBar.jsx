//Navagation bar
import React from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link  } from 'react-router-dom';
import {setMode, setLogout } from '../states/index';
import { AppBar, Box, Typography, Toolbar, Avatar, Button, useScrollTrigger, Slide, useTheme, HideOnScroll, DarkMode, LightMode, } from '@mui/material';

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const user = useSelector((state) => state.user);
  const { userName } = useSelector((state) => state.user);
  const trigger = useScrollTrigger();


  return (
    <div>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar>
            <Typography fontWeight="bold" fontSize="16px" component={Link} to="/">MyAnimeLibrary</Typography>
            <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" sx={{"& > a": { padding:"0 12px"}}}> 
              {user && (
                <>
                <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${userName}`} >Profile</Typography>
                <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${userName}/animelist`} >Anime List</Typography>
                <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${userName}/mangalist`} >Manga List</Typography>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </div>
  )
}
