import React from 'react'
import {Card, CardContent, Avatar, Button, Typography, Box} from '@mui/material'
import {Twitter, Instagram, YouTube, GitHub} from "@mui/icons-material";
import { Link, useNavigate  } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProfileCard({user}) {
    const loggedUser = useSelector((state) => state.user);
    const navigate = useNavigate();
    //console.log(loggedUser);
    const isFollowing = loggedUser.following.includes(user.userName);

    console.log(isFollowing);
    async function handleClick(value){
        console.log("Handle Click")
        console.log(value)

    }


    return (
        <Card id="profile-card" sx={{maxWidth: 350, borderRadius: "12px", textAlign: "center"}}>
            <CardContent>
                <Avatar sx={{ width: 150, height: 150, margin: "1em auto 0" }} src={`http://localhost:5000/assets/${user.picturePath}`}/>
                <Typography variant='h5' mt="0.5em" fontWeight="bold" >{`${user.firstName} ${user.lastName}`}</Typography>
                <Typography variant='subtitle1'>{`@${user.userName}`}</Typography>
            </CardContent>

            <Box 
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "2em",
                    alignItems: "center",
                    marginBottom: "10px"
            }}>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${user.socialMediaHandles.twitter}`}>{user.socialMediaHandles.twitter ? <Twitter/>:""}</Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${user.socialMediaHandles.instagram}`}>{user.socialMediaHandles.instagram ? <Instagram/>: ""}</Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${user.socialMediaHandles.youtube}`}>{user.socialMediaHandles.youtube ? <YouTube/>: ""}</Typography>
                <Typography rel="noopener noreferrer" target="_blank" component={Link} to={`${user.socialMediaHandles.github}`}>{user.socialMediaHandles.github ? <GitHub/>: ""}</Typography>
                
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
                        borderBottom: "1px solid #ddd",
                        '&:hover':{
                            background: "#CFD8DC",
                        }
                    }
                }}
            >
                <Box component={Link} to={`/user/${user.userName}/animelist`} sx={{borderRight:"1px solid #ddd", borderTop:"1px solid #ddd"}}>
                    <Typography variant='h6'>{user.animes.length}</Typography>
                    <Typography variant='subtitle1'>Animes</Typography>
                </Box>

                <Box component={Link} to={`/user/${user.userName}/mangalist`} sx={{borderTop:"1px solid #ddd"}}>
                    <Typography  variant='h6'>{user.mangas.length}</Typography>
                    <Typography variant='subtitle1'>Mangas</Typography>
                </Box>
                <Box sx={{borderRight:"1px solid #ddd"}}>
                    <Typography variant='h6'>{user.following.length}</Typography>
                    <Typography variant='subtitle1'>Following</Typography>
                </Box>
                <Box>
                    <Typography variant='h6'>{user.followers.length}</Typography>
                    <Typography variant='subtitle1'>Followers</Typography>
                </Box>
            </Box>
            <Box display="flex">
                {loggedUser && loggedUser.userName  === user.userName ? 
                    <Button 
                        sx={{flexBasis:"100%", padding: "15px"}}
                        onClick={() => {navigate('/settings')}}
                    >Edit Profile</Button> : 
                    <Button
                        sx={{flexBasis:"100%", padding: "15px"}}
                        onClick={(e) => handleClick(e.target.textContent)}
                    >
                    {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    
                }

      
            </Box>
        </Card>
    )
}
