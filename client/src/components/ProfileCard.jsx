import React from 'react'
import {Card, CardContent, Avatar, Divider, Typography, Box} from '@mui/material'
import {Twitter, Instagram, YouTube, GitHub} from "@mui/icons-material";

import { Link  } from 'react-router-dom';

export default function ProfileCard({firstName, lastName, userName, animes, mangas, picturePath, socialMediaHandles}) {
    return (
        <Card id="profile-card" sx={{maxWidth: 350, borderRadius: "12px", textAlign: "center"}}>
            <CardContent>
                <Avatar sx={{ width: 150, height: 150, margin: "1em auto 0" }} src={`http://localhost:5000/assets/${picturePath}`}/>
                <Typography variant='h5' mt="0.5em" fontWeight="bold" >{`${firstName} ${lastName}`}</Typography>
                <Typography variant='subtitle1'>{`@${userName}`}</Typography>
            </CardContent>
            <Divider variant="middle" />
            <Box display="flex" 
                sx={{"& > a": { 
                    textDecoration:"none", 
                    color:"inherit",
                    margin: "20px 30px",
                    flex: "auto"
                }}}
            >
                <Box component={Link} to={`/user/${userName}/animelist`}>
                    <Typography variant='h6'>{animes.length}</Typography>
                    <Typography variant='subtitle1'>Total Animes</Typography>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem/>
                <Box component={Link} to={`/user/${userName}/mangalist`}>
                    <Typography  variant='h6'>{mangas.length}</Typography>
                    <Typography variant='subtitle1'>Total Mangas</Typography>
                </Box>
            </Box>
            <Divider variant="middle"/>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: ".5em",
                padding: ".5em",
                gap: "2em",
                alignItems: "center"
            }}>
                <Typography><Twitter/></Typography>
                <Typography><Instagram/></Typography>
                <Typography><YouTube/></Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${socialMediaHandles.github}`}>{socialMediaHandles.github ? <GitHub/>: ""}</Typography>

            </Box>
        </Card>
    )
}
