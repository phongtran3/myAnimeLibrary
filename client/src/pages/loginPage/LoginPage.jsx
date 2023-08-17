//Login and Registration page for user
import React from 'react'
import {Box, useMediaQuery, Typography} from '@mui/material';
import Form from './Form';
import {Link} from "react-router-dom";

//Array of images for background. 
//No copyright intended. All right goes to the orginal owner.
//May save into folder
// const Images =[
//     'https://i.pinimg.com/originals/bf/16/a6/bf16a658662656209bcaacaa76ca771a.jpg',
//     'https://wallpaperaccess.com/full/4752377.jpg',
//     'https://i.redd.it/1zw15t9s64r91.jpg',
//     'https://rare-gallery.com/uploads/posts/4562780-anime-tokyo-ghoul-kaneki-ken.jpg',
//   ]


export default function LoginPage() {
  //const backgroundImgs= Images[Math.floor(Math.random() * Images.length)];
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1040px)");
  return (
    <Box 
      sx={{
        //backgroundColor: "#edf1f5", 
        background:"radial-gradient(circle at 10% 20%, rgb(186, 190, 245) 0%, rgb(192, 192, 245) 33.1%, rgb(218, 203, 246) 90%)",
        width:"100%", 
        height:"100vh",
        overflow:"auto",
      }}
    >
      <Box width="100%" p=".5rem" textAlign="center" position="relative" id="navbar">
        <Typography 
          sx={{
            color: "#111111", 
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
          gridTemplateColumns: !desktopScreen ? "auto" : "auto 55%",
          height:"800px",
          width: desktopScreen ? "1000px" : tabletScreen ? "600px" : "100%",
          maxWidth:"1000px",
          margin: "2rem auto",
          borderRadius:"10px",
          boxShadow: tabletScreen ? "4px 4px 12px 2px rgba(0, 0, 0, 0.6)" : null
        }}
      >
        <Form/>
      </Box >
    </Box>
  )
}
