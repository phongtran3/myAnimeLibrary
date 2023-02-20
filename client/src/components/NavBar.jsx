//Navagation bar
import React from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate  } from 'react-router-dom';
import {setMode, setLogout } from '../states/index';
import { AppBar, Typography, Toolbar, Avatar, Button, useScrollTrigger, Slide, useTheme, HideOnScroll } from '@mui/material';

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const user = useSelector((state) => state.user);
  const trigger = useScrollTrigger();


  return (
    <div>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6">Scroll Down to Hide App Bar</Typography>
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </div>
  )
}
