import React, { useState, useEffect } from 'react'
import {Card, CardContent, Avatar, Button, Typography, Box, Alert, Snackbar, ButtonBase, useTheme} from '@mui/material'
import {Twitter, Instagram, YouTube, GitHub} from "@mui/icons-material";
import { Link, useNavigate  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSiteUser } from '../states';
import Follow from './Follow';

export default function ProfileCard({user, setUser, loggedUser, followersArr, followingArr, desktopScreen}) {
    const [openAlert, setOpenAlert] = useState(false);
    const [openFollows, setOpenFollows] = useState(false);
    const [type, setType] = useState("");

    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { palette } = useTheme();

    const isFollowing = loggedUser ? loggedUser.following.includes(user._id) : "";
   
    async function handleFollowUnfollow(userId){
        if(!loggedUser){
            setOpenAlert(true);
        }
        else {
            await axios.patch(
                `http://localhost:5000/users/${loggedUser._id}/${userId}`,
                {data: null},
                {headers: { Authorization: `${token}`, "Content-Type": "application/json",}}
            ).then(res => {
                console.log(res.data)
                if(openFollows){
                    if(loggedUser._id === user._id)
                        setUser(res.data[0])
                    // else if (loggedUser._id !== user._id)
                    //     setUser(res.data[1])
                } else
                    setUser(res.data[1])
                //setUser(openFollows ? res.data[0] : res.data[1]);
                dispatch(setSiteUser({
                    user: res.data[0],
                    token: token,
                }));
                setOpenAlert(true);
            }).catch(err =>{
                if (err.response){
                    console.log(err.response.data);
                }
                console.log(err);
            })
        }
    }
    function handleCloseAlert(reason){
        if (reason === 'clickaway') return;
        setOpenAlert(false);
    }

    function handleFollowClose(){
        setOpenFollows(false);
    }

    function handleFollowOpen(select){
        setOpenFollows(true);
        setType(select);

    }

    useEffect(()=> {
        console.log("profile card useeffect")
    },[])

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
                        marginBottom: "10px",
                        '& > a':{
                            transition: "transform 250ms"
                        },
                        '& > a:hover':{
                            transform: "translateY(-2px)"
                        }
                }}>
                    <Typography 
                        sx={{color: "#00acee"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.twitter}`}
                    >{user.socialMediaHandles.twitter ? <Twitter/>:""}</Typography>
                    <Typography 
                        sx={{color: "black"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.instagram}
                    `}>{user.socialMediaHandles.instagram ? <Instagram/>: ""}</Typography>
                    <Typography 
                        sx={{color: "#eb3223"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.youtube}`}
                    >{user.socialMediaHandles.youtube ? <YouTube/>: ""}</Typography>
                    <Typography 
                        sx={{color: "black"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.github}`}
                    >{user.socialMediaHandles.github ? <GitHub/>: ""}</Typography>
                    
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
                        <Typography variant='h6'>{user.animes.length}</Typography>
                        <Typography variant='subtitle1'>Animes</Typography>
                    </Box>

                    <Box component={Link} to={`/user/${user.userName}/mangalist`} sx={{}}>
                        <Typography  variant='h6'>{user.mangas.length}</Typography>
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
                        <Typography variant='h6'>{user.following.length}</Typography>
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
                        <Typography variant='h6'>{user.followers.length}</Typography>
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
                        <Button onClick={() => {navigate('/settings')}}>Edit Profile</Button> 
                        : 
                        <Button onClick={(e) => handleFollowUnfollow(user._id)} >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    }
                </Box>

                {/* <Snackbar 
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
                </Snackbar> */}
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
                <Avatar sx={{ width: 150, height: 150, margin: "0 auto" }} src={`http://localhost:5000/assets/${user.picturePath}`}/>
                {loggedUser && loggedUser.userName  === user.userName ? 
                    <Button onClick={() => {navigate('/settings')}}>Edit Profile</Button> 
                    : 
                    <Button onClick={(e) => handleFollowUnfollow(user._id)}>{isFollowing ? "Unfollow" : "Follow"}</Button>
                }
                <Typography variant='h5' mt="1rem" fontWeight="bold" >{`${user.firstName} ${user.lastName}`}</Typography>
                <Typography variant='subtitle1'>{`@${user.userName}`}</Typography>

                <Box 
                    sx={{
                        marginTop:"1rem",
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
                    <Typography 
                        sx={{color: "#00acee"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.twitter}`}
                    >{user.socialMediaHandles.twitter ? <Twitter/>:""}</Typography>
                    <Typography 
                        sx={{color: "black"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.instagram}
                    `}>{user.socialMediaHandles.instagram ? <Instagram/>: ""}</Typography>
                    <Typography 
                        sx={{color: "#eb3223"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.youtube}`}
                    >{user.socialMediaHandles.youtube ? <YouTube/>: ""}</Typography>
                    <Typography 
                        sx={{color: "black"}}
                        rel="noopener noreferrer" 
                        target="_blank" 
                        component={Link} 
                        to={`${user.socialMediaHandles.github}`}
                    >{user.socialMediaHandles.github ? <GitHub/>: ""}</Typography>
                    
                </Box>
                {/* sx={{
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
                    }} */}
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
                        <Typography variant='h6'>{user.animes.length}</Typography>
                        <Typography variant='subtitle1'>Animes</Typography>
                    </Box>

                    <Box component={Link} to={`/user/${user.userName}/mangalist`} sx={{borderRight:"1px solid #9e9e9e", borderTop:"1px solid #9e9e9e"}}>
                        <Typography  variant='h6'>{user.mangas.length}</Typography>
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
                        <Typography variant='h6'>{user.following.length}</Typography>
                        <Typography variant='subtitle1'>Following</Typography>
                    </ButtonBase>
                    <ButtonBase component="div" 
                        sx={{
                            borderRight:"1px solid #9e9e9e",
                        }}
                        onClick={() => {
                            if(loggedUser){
                                console.log("open");
                                handleFollowOpen("follower");
                            }
                            else
                                setOpenAlert(true);
                        }}
                    >
                        <Typography variant='h6'>{user.followers.length}</Typography>
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
