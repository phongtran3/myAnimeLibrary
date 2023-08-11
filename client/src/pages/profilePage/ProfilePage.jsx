//Profile page for other users
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { 
    Box, 
    Typography, 
    useMediaQuery, 
    useTheme 
} from "@mui/material";

import NavBar from '../../components/NavBar';
import ProfileCard from '../../components/ProfileCard';
import Footer from '../../components/Footer';
import PreviewList from '../../components/PreviewList';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [followersArr, setFollowersArr] = useState([]);
  const [followingArr, setFollowingArr] = useState([]);
  const [openFollows, setOpenFollows] = useState(false);

  const desktopScreen = useMediaQuery("(min-width: 1100px)");

  const { userName } = useParams();
  const token = useSelector((state) => state.token);
  const loggedUser = useSelector((state) => state.user);
  const { palette } = useTheme();

  async function getUser(){
    try {
        // Fetch user details
        const userResponse = await axios.get(
            `https://myanimelibrary.onrender.com/users/${userName}`,
            {headers: { Authorization: `${token}` }}
        );
        // If the loggedUser exists, fetch followers and following details
        if(loggedUser){
            const followersResponse = await axios.get(
                `https://myanimelibrary.onrender.com/users/${userResponse.data._id}/follower`
            );
            let tempFollowingArr = followersResponse.data[1];
            let tempFollowerArr = followersResponse.data[0];
            let index = tempFollowingArr.findIndex(item => item._id === loggedUser._id);
            if(index !== -1){
                tempFollowingArr.unshift(tempFollowingArr.splice(index, 1)[0]);
            }
            index = tempFollowerArr.findIndex(item => item._id === loggedUser._id);
            if(index !== -1){
                tempFollowerArr.unshift(tempFollowerArr.splice(index, 1)[0]);
            }
            setFollowersArr(tempFollowerArr);
            setFollowingArr(tempFollowingArr);
        }
        setUser(userResponse.data);
    } catch (err) {
        if (err.response){
            console.log(err.response.data);
        } else {
            // Log general errors not related to API response, for example network issues
            console.log(err);
        }
    }
  }

  useEffect(() => {
    console.log("Profile Page useEffect")
    setOpenFollows(false)
    getUser();
  }, [userName]); 

  if (!user) {
    return null;
  }
  //const {firstName, lastName, animes, mangas, picturePath, socialMediaHandles, following, followers } = user
  const progress = [];
  for(let i = 0; i < user.animes.length; i++){
    if(user.animes[i].userStatus === 'WATCHING')
      progress.push(user.animes[i])
      
  }
  for(let i = 0; i < user.mangas.length; i++){
    if(user.mangas[i].userStatus === 'READING')
      progress.push(user.mangas[i])
      
  }
  return (
    <>
    <Box id="page-content"
      sx={{
        //height:"100%", 
        minHeight:"100vh",
        width:"100%"
      }}
    >
      <NavBar />
      <Box 
        id="content-container" 
        sx={{
          margin: desktopScreen ? "2rem auto 0" : "2rem",
          maxWidth:"1520px",
          //height:"100%",
          //minHeight:"100vh",
        }}
      >
        <Box 
          id="content" 
          display= {desktopScreen ? "grid" : "block"}
          gridTemplateColumns= "calc(40% - 30px) 60%"
          gap="30px"
        >
          <Box id="profile-card"> 
              <ProfileCard 
                user={user}
                setUser={setUser}
                loggedUser={loggedUser}
                followersArr={followersArr}
                followingArr={followingArr}
                desktopScreen={desktopScreen}
                openFollows={openFollows}
                setOpenFollows={setOpenFollows}
              />

          </Box>
          {/* grid-auto-columns: minmax(8rem, auto);
          grid-auto-flow: column; */}
          <Box id="users-lists"
            sx={{
              marginTop: desktopScreen ? null : "1rem",
              "div:not(:first-of-type) > a":{
                display:"flex",
                alignItems:"center",
                "& > h3:hover":{
                    //color: '#673ab7',
                    color: palette.primary.dark
                },
                "& > div":{
                  marginLeft: "auto",
                  fontSize:"1rem",
                  "&:hover": {
                    //color: '#673ab7',
                    color: palette.primary.dark,
                    fontWeight: "600",
                  },
                }
              }
            }}
          >
            <Box id="progress-list-preview-wrap"
              sx={{
                display: !progress.length ? "none" : null
              }}
            >
              <Typography variant="h5" fontWeight="bold">In Progress</Typography>
              <PreviewList medium={progress} />
            </Box>

            <Box id="anime-list-preview-wrap"
              sx={{
                marginTop:"1rem",
                display: !user.animes.length ? "none" : null
              }}
            >
              <Typography sx={{textDecoration: "none", color: "inherit"}} component={Link} to={`/user/${user.userName}/animelist`} variant="h6">
                <h3>Animes</h3>
                <div>View All</div>
              </Typography>
              <PreviewList medium={user.animes.slice(-6)} />
            </Box>

            <Box id="manga-list-preview-wrap" 
              sx={{
                marginTop:"1rem",
                display: !user.mangas.length ? "none" : null
              }}
            >
              <Typography sx={{textDecoration: "none", color: "inherit"}} component={Link} to={`/user/${user.userName}/mangalist`} variant="h6">
                <h3>Mangas</h3>
                <div>View All</div>
              </Typography>
              <PreviewList medium={user.mangas.slice(-6)} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
    <Footer/>
    </>
  )
}
