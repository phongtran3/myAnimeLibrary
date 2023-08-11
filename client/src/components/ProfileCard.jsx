import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSiteUser } from '../states';
import {
    Card,
    CardContent,
    Avatar,
    Button,
    Typography,
    Box,
    Alert,
    Snackbar,
    ButtonBase,
    useTheme
} from '@mui/material';
import {
    Twitter,
    Instagram,
    YouTube,
    GitHub
} from "@mui/icons-material";
import { Link, useNavigate } from 'react-router-dom';
import Follow from './Follow';
import axios from 'axios';

export default function ProfileCard({openFollows, setOpenFollows, user, setUser, loggedUser, followersArr, followingArr, desktopScreen}) {
    const { firstName, lastName, animes, mangas, picturePath, socialMediaHandles, following, followers} = user;
    const [openAlert, setOpenAlert] = useState(false);
    const [type, setType] = useState("");
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const isFollowing = loggedUser ? loggedUser.following.includes(user._id) : "";
   
    async function handleFollowUnfollow(userId) {
        if (!loggedUser) {
            setOpenAlert(true);
            return;
        }
        try {
            const response = await axios.patch(
                `https://myanimelibrary.onrender.com/users/${loggedUser._id}/${userId}`,
                { data: null },
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json"
                    }
                }
            );
            const updatedUser = openFollows && loggedUser._id === user._id ? response.data[0] : response.data[1];
            setUser(updatedUser);
            dispatch(setSiteUser({
                user: response.data[0],
                token
            }));
            setOpenAlert(true);
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
            }
        }
    }
    
    function handleCloseAlert(reason){
        if (reason === 'clickaway') return;
          setOpenAlert(false);
    }

    function handleFollowClose(){ setOpenFollows(false);}

    function handleFollowOpen(select){
        setOpenFollows(true);
        setType(select);
    }


    function SocialMediaLink({color, handle, icon: IconComponent}) {
        if (!handle) return null;
        return (
            <Typography 
                sx={{ color }}
                rel="noopener noreferrer" 
                target="_blank" 
                component={Link} 
                to={handle}
            >
                <IconComponent />
            </Typography>
        );
    }

    return (
        <>
            <Snackbar 
                open={openAlert} 
                autoHideDuration={2000}
                onClose={(event, reason) => handleCloseAlert(reason)} 
                anchorOrigin={{vertical: 'top', horizontal:'center'}}
            >
                {!loggedUser ?
                    <Alert onClose={(event, reason) => handleCloseAlert(reason)} severity='error'>
                        Unauthorized. Please log in to follow user.
                    </Alert> : 
                    <Alert onClose={(event, reason) => handleCloseAlert(reason)} severity='success'>
                        Successfully {isFollowing ? "Followed" : "Unfollowed"} User.
                    </Alert> 
                }
            </Snackbar>
            {desktopScreen ?
            <Card id="profile-card" 
                sx={{
                    background: palette.background.alt,
                    maxWidth: "350px", 
                    borderRadius: "12px", 
                    textAlign: "center", 
                    margin:"0 auto",
                    boxShadow:"rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;",
                }}
            >
                <CardContent
                    id="profile-content"
                    sx={{
                        ".MuiTypography-root":{
                            color: palette.neutral.dark,
                        }
                    }}
                >
                    <Avatar sx={{ width: 150, height: 150, margin: "1em auto 0" }} src={`https://myanimelibrary.onrender.com/assets/${picturePath}`}/>
                    <Typography variant='h5' mt="0.5em" fontWeight="bold" >{`${firstName} ${lastName}`}</Typography>
                    <Typography variant='subtitle1'>{`@${user.userName}`}</Typography>
                </CardContent>

                <Box 
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2em",
                        alignItems: "center",
                        marginBottom: "10px",
                        '& > a':{
                            transition: "transform 250ms"
                        },
                        '& > a:hover':{
                            transform: "translateY(-2px)"
                        }
                }}>
                    <SocialMediaLink color="#00acee" handle={socialMediaHandles.twitter} icon={Twitter} />
                    <SocialMediaLink color="black" handle={socialMediaHandles.instagram} icon={Instagram} />
                    <SocialMediaLink color="#eb3223" handle={socialMediaHandles.youtube} icon={YouTube} />
                    <SocialMediaLink color="black" handle={socialMediaHandles.github} icon={GitHub} />
                </Box>
                {/* <Divider variant="middle" /> */}

                <Box  id="profile-stats"
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        "& > a, div": { 
                            background: palette.neutral.medium,
                            padding:"10px 15px",
                            textDecoration:"none", 
                            color:"inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            flexBasis: "50%",
                            //background: "#ECEFF1",
                            borderBottom: "1px solid #9e9e9e",
                            cursor: "pointer",
                            '&:hover':{
                                //background: "#CFD8DC",
                                background: "#b39ddb",
                            }
                        },
                        ".MuiTypography-root":{
                            color: "#111111",
                        }
                    }}
                >   
                {/* borderTop:"1px solid #9e9e9e"*/}
                    <Box component={Link} to={`/user/${user.userName}/animelist`} sx={{borderRight:"1px solid #9e9e9e", }}>
                        <Typography variant='h6'>{animes.length}</Typography>
                        <Typography variant='subtitle1'>Animes</Typography>
                    </Box>

                    <Box component={Link} to={`/user/${user.userName}/mangalist`}>
                        <Typography  variant='h6'>{mangas.length}</Typography>
                        <Typography variant='subtitle1'>Mangas</Typography>
                    </Box>
                    <ButtonBase component="div" sx={{borderRight:"1px solid #9e9e9e"}} 
                        onClick={() => {
                            if(loggedUser)
                                handleFollowOpen("following");
                            else
                                setOpenAlert(true);
                        }}
                    >
                        <Typography variant='h6'>{following.length}</Typography>
                        <Typography variant='subtitle1'>Following</Typography>
                    </ButtonBase>
                    <ButtonBase component="div" 
                        onClick={() => {
                            if(loggedUser)
                                handleFollowOpen("follower");
                            else
                                setOpenAlert(true);
                        }}
                    >
                        <Typography variant='h6'>{followers.length}</Typography>
                        <Typography variant='subtitle1'>Followers</Typography>
                    </ButtonBase>
                </Box>
                <Box
                    sx={{
                        display:"flex",
                        background: '#673AB7',
                        '& .MuiButtonBase-root':{
                            flexBasis:"100%",
                            padding:"10px",
                            color:"#111111",
                            fontWeight:"600",
                            fontSize: "1rem",
                            textTransform: "none",
                            '&:hover':{
                                background:"#9575CD"
                            }
                        },
                        
                    }}
                >
                    {loggedUser && loggedUser.userName  === user.userName ? 
                        <Button component={Link} to={'/settings'} onClick={() => {navigate('/settings')}}>Edit Profile</Button> 
                        : 
                        <Button onClick={(e) => handleFollowUnfollow(user._id)} >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    }
                </Box>
            </Card>
            :
            //NON DESKTOP
            <Box 
                id="profile-content"
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                    '& > .MuiButtonBase-root':{
                        marginTop: "1rem",
                        background: '#673AB7',
                        color:"#111111",
                        fontWeight:"600",
                        fontSize: "1rem",
                        textTransform: "none",
                        padding:"6px 12px",
                        borderRadius:"8px",
                        '&:hover':{
                            background:"#9575CD"
                        },
                    },
                    "& > .MuiTypography-root":{
                        color: palette.neutral.dark,
                    }
                }}
            >
                <Avatar sx={{ width: 150, height: 150, margin: "0 auto" }} src={`https://myanimelibrary.onrender.com/assets/${picturePath}`}/>
                {loggedUser && loggedUser.userName  === user.userName ? 
                    <Button onClick={() => {navigate('/settings')}}>Edit Profile</Button> 
                    : 
                    <Button onClick={(e) => handleFollowUnfollow(user._id)}>{isFollowing ? "Unfollow" : "Follow"}</Button>
                }
                <Typography variant='h5' mt="1rem" fontWeight="bold" >{`${firstName} ${lastName}`}</Typography>
                <Typography variant='subtitle1'>{`@${user.userName}`}</Typography>

                <Box 
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "2em",
                        alignItems: "center",
                        margin: ".75rem 0",
                        '& > a':{
                            transition: "transform 250ms"
                        },
                        '& > a:hover':{
                            transform: "translateY(-2px)"
                        }
                }}>
                    <SocialMediaLink color="#00acee" handle={socialMediaHandles.twitter} icon={Twitter} />
                    <SocialMediaLink color="black" handle={socialMediaHandles.instagram} icon={Instagram} />
                    <SocialMediaLink color="#eb3223" handle={socialMediaHandles.youtube} icon={YouTube} />
                    <SocialMediaLink color="black" handle={socialMediaHandles.github} icon={GitHub} />
                </Box>

                <Box id="profile-stats"
                    sx={{
                        marginTop:"1rem",
                        width:"100%",
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
                            background: palette.neutral.medium,
                            borderBottom: "1px solid #9e9e9e",
                            cursor: "pointer",
                            '&:hover':{
                                background: "#b39ddb",
                            }
                        },
                        ".MuiTypography-root":{
                            color: "#111111",
                        }
                    }}
                >
                    <Box component={Link} to={`/user/${user.userName}/animelist`} sx={{borderLeft: "1px solid #9e9e9e", borderRight:"1px solid #9e9e9e", borderTop:"1px solid #9e9e9e"}}>
                        <Typography variant='h6'>{animes.length}</Typography>
                        <Typography variant='subtitle1'>Animes</Typography>
                    </Box>

                    <Box component={Link} to={`/user/${user.userName}/mangalist`} sx={{borderRight:"1px solid #9e9e9e", borderTop:"1px solid #9e9e9e"}}>
                        <Typography  variant='h6'>{mangas.length}</Typography>
                        <Typography variant='subtitle1'>Mangas</Typography>
                    </Box>
                    <ButtonBase component="div" sx={{borderLeft: "1px solid #9e9e9e", borderRight:"1px solid #9e9e9e"}} 
                        onClick={() => {
                            if(loggedUser)
                                handleFollowOpen("following");
                            else
                                setOpenAlert(true);
                        }}
                    >
                        <Typography variant='h6'>{following.length}</Typography>
                        <Typography variant='subtitle1'>Following</Typography>
                    </ButtonBase>
                    <ButtonBase component="div" 
                        sx={{
                            borderRight:"1px solid #9e9e9e",
                        }}
                        onClick={() => {
                            if(loggedUser){
                                handleFollowOpen("follower");
                            }
                            else
                                setOpenAlert(true);
                        }}
                    >
                        <Typography variant='h6'>{followers.length}</Typography>
                        <Typography variant='subtitle1'>Followers</Typography>
                    </ButtonBase>
                </Box>
            </Box>
        }
            {openFollows && 
                <Follow 
                    loggedUser={loggedUser}
                    user={user}
                    open={openFollows}
                    type={type}
                    arr={type === "following" ? followingArr : followersArr}
                    handleClose={handleFollowClose}
                    handleFollowUnfollow={handleFollowUnfollow}
                />
            }
        </>
    )
}
