import React from 'react'
import {Card, CardContent, Avatar, Button, Typography, Box} from '@mui/material'
import {Twitter, Instagram, YouTube, GitHub} from "@mui/icons-material";
import { Link  } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProfileCard({firstName, lastName, userName, animes, mangas, picturePath, socialMediaHandles, followers, following}) {
    const loggedUser = useSelector((state) => state.user);

    return (
        <Card id="profile-card" sx={{maxWidth: 350, borderRadius: "12px", textAlign: "center"}}>
            <CardContent>
                <Avatar sx={{ width: 150, height: 150, margin: "1em auto 0" }} src={`http://localhost:5000/assets/${picturePath}`}/>
                <Typography variant='h5' mt="0.5em" fontWeight="bold" >{`${firstName} ${lastName}`}</Typography>
                <Typography variant='subtitle1'>{`@${userName}`}</Typography>
            </CardContent>

            <Box 
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2em",
                    alignItems: "center",
                    marginBottom: "10px"
            }}>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${socialMediaHandles.twitter}`}>{socialMediaHandles.twitter ? <Twitter/>:""}</Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${socialMediaHandles.instagram}`}>{socialMediaHandles.instagram ? <Instagram/>: ""}</Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${socialMediaHandles.youtube}`}>{socialMediaHandles.youtube ? <YouTube/>: ""}</Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${socialMediaHandles.github}`}>{socialMediaHandles.github ? <GitHub/>: ""}</Typography>
                
            </Box>
            {/* <Divider variant="middle" /> */}

            <Box  id="profile-stats"
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    "& > a, div": { 
                        padding:"10px 15px",
                        textDecoration:"none", 
                        color:"inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        flexBasis: "50%",
                        background: "#ECEFF1",
                        '&:hover':{
                            background: "#CFD8DC",
                        }
                    }
                }}
            >
                <Box component={Link} to={`/user/${userName}/animelist`}>
                    <Typography variant='h6'>{animes.length}</Typography>
                    <Typography variant='subtitle1'>Animes</Typography>
                </Box>

                <Box component={Link} to={`/user/${userName}/mangalist`}>
                    <Typography  variant='h6'>{mangas.length}</Typography>
                    <Typography variant='subtitle1'>Mangas</Typography>
                </Box>
                <Box>
                    <Typography variant='h6'>{following.length}</Typography>
                    <Typography variant='subtitle1'>Following</Typography>
                </Box>
                <Box>
                    <Typography variant='h6'>{followers.length}</Typography>
                    <Typography variant='subtitle1'>Followers</Typography>
                </Box>
            </Box>
            <Box display="flex">
                <Button sx={{flexBasis:"100%", padding: "15px"}}>
                    {loggedUser.userName === userName ? "Edit Profile" : "Follow"}
                </Button>
            </Box>
        </Card>
    )
}
