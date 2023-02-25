//Login and Registration page for user
import React from 'react'
import axios from 'axios';
import {Box, useMediaQuery, Typography, Paper } from '@mui/material';
import Form from './Form';


//Array of images for background. 
//No copyright intended. All right goes to the orginal owner.
//May save into folder
const Images =[
    'https://i.pinimg.com/originals/bf/16/a6/bf16a658662656209bcaacaa76ca771a.jpg',
    'https://wallpaperaccess.com/full/4752377.jpg',
    'https://i.redd.it/1zw15t9s64r91.jpg',
    'https://rare-gallery.com/uploads/posts/4562780-anime-tokyo-ghoul-kaneki-ken.jpg',
  ]


export default function LoginPage() {
  const backgroundImgs= Images[Math.floor(Math.random() * Images.length)];
  const isDesktopScreen = useMediaQuery("(min-width: 1000px)");

  return (
    <div
      style={{
        display: 'flex',
        backgroundImage: `url(${backgroundImgs})`,
        width: '100%',
        height: '100%',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        opacity: '.75',
    }}>
    
    <Paper 
        //p="1rem"
        //m="auto"
        //borderRadius="1.5rem"
        elevation={12}
        sx={{ 
          backdropFilter: "blur(12px)",
          // width: isDesktopScreen ? "40%" : "70%", 
          padding: "1rem 2rem",
          margin: "auto",
          borderRadius:"1.5rem",
          background: "transparent"
        }}
    >
      <Form/>
    </Paper>



    </div>
  )
}
