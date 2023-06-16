//Login and Registration page for user
import React from 'react'
import {Box, useMediaQuery, Typography, Paper } from '@mui/material';
import Form from './Form';
import {Link } from "react-router-dom";
import { BorderRight } from '@mui/icons-material';

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
    <Box sx={{backgroundColor: "#edf1f5", width:"100%", height:"100%"}}>
      <Box width="100%" p=".5rem" textAlign="center" position="relative" id="navbar">
        <Typography 
          sx={{
            textDecoration:"none",
            "&:hover": {
              color: '#b39ddb',
              cursor: "pointer",
            },
          }} 
          fontWeight="bold" 
          fontSize="32px" 
          color="primary" 
          component={Link} 
          to="/"
          >
            myAnimeLibrary
         </Typography>
      </Box>


      <Box id="form-card"
        sx={{
          display:"grid",
          gridTemplateColumns: "auto 55%",
          height: "800px",
          //width: "75%",
          width:"1000px",
          margin: "0 auto",
          marginTop:"2rem",
          borderRadius:"10px",
          boxShadow: "4px 4px 12px 2px rgba(0, 0, 0, 0.6)"
        }}
      >
        <Box id="img" sx={{width:"100%", height:"inherit"}}>
          <img 
            style={{
              width:"100%", 
              height:"100%", 
              objectFit:"cover",
              borderRadius: "10px"
            }} 
            //src={`https://i.pinimg.com/originals/bf/16/a6/bf16a658662656209bcaacaa76ca771a.jpg`}
            //src='https://preview.redd.it/b7zeuido3f461.jpg?auto=webp&s=6f88b8678630d9e16afe422b0758e45cdb3c63b2'
            src={'https://w0.peakpx.com/wallpaper/245/1014/HD-wallpaper-sung-jin-woo-magenta-manhwa-tbate-anime-aesthetic-the-beginning-after-the-end-manga-purple-shadow-monarch.jpg'}
          />
        </Box>
        
        <Form/>
      </Box >



    </Box>
  )
}
