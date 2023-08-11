import React from 'react'
import { Box, Typography } from '@mui/material'
import {LinkedIn, GitHub, Instagram } from "@mui/icons-material"
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <Box 
        id="footer" 
        sx={{
            marginTop:"1rem",
            backgroundColor:"#424242",
            textAlign:"center",
            padding:"1rem 0",
        }}
    >
        <Box>
            <Typography sx={{color: "#fafafa", fontWeight:"600"}}>Phong Tran © 2023</Typography>
            <Box 
              id="social-media"
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "center",
                gap: "1em",
                alignItems: "center",
                '& > a':{
                    color: "#fafafa",
                    transition: "transform 250ms",
                    ".MuiSvgIcon-root":{
                      width:"1.5em",
                      height:"1.5em",
                    }
                },
                '& > a:hover':{
                    transform: "translateY(-2px)"
                }
        }}
            >
            <Typography 
                rel="noopener noreferrer" 
                target="_blank" 
                component={Link} 
                to={"https://www.linkedin.com/in/phong-tran230/"}
            >
              <LinkedIn/>
            </Typography>

            <Typography 
                rel="noopener noreferrer" 
                target="_blank" 
                component={Link} 
                to={"https://github.com/phongtran3"}
            >
              <GitHub/>
            </Typography>
            
            <Typography 
                rel="noopener noreferrer" 
                target="_blank" 
                component={Link} 
                to={"https://www.instagram.com/phongtran_3/"}
            >
              <Instagram/>
            </Typography>

            </Box>
        </Box>
    </Box>
  )
}
