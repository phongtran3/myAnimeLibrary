//Profile page for other users
import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import ProfileCard from '../../components/ProfileCard'
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { Box, Typography, useMediaQuery, useTheme} from "@mui/material";
import PreviewList from '../../components/PreviewList';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [followersArr, setFollowersArr] = useState([]);
  const [followingArr, setFollowingArr] = useState([]);

  //const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1100px)");

  const { userName } = useParams();
  const token = useSelector((state) => state.token);
  const loggedUser = useSelector((state) => state.user);
  const { palette } = useTheme();

  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      if(loggedUser){
        axios.get(`http://localhost:5000/users/${res.data._id}/follower`)
          .then(res =>{
              //Move logged in user to the top of the list
              let tempFollowingArr = res.data[1];
              let tempFollowerArr = res.data[0]
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
            
            }).catch(err => {
              if (err.response){
                console.log(err.response.data);
              }
              console.log(err);
            }) 
        }
      setUser(res.data);
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
      console.log(err);
    }) 
  }

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  //console.log(user)
  console.log(followersArr);
  console.log(followingArr);
  return (
    <Box sx={{height:"100%", width:"100%"}}>
      <NavBar />
      <Box id="content-container" margin="3em auto 0" maxWidth="1520px" padding="0 3rem 5rem">
        <Box id="content" 
          display= {desktopScreen ? "grid" : "block"}
          gridTemplateColumns= "calc(40% - 30px) 60%"
          gap="30px"
        >
          <Box id="section-1"> 
            {/* will rename id later */}
              <ProfileCard 
                user={user}
                setUser={setUser}
                loggedUser={loggedUser}
                followersArr={followersArr}
                followingArr={followingArr}
                desktopScreen={desktopScreen}
              />

          </Box>
          {/* grid-auto-columns: minmax(8rem, auto);
          grid-auto-flow: column; */}
          <Box id="section-2" 
            sx={{
              marginTop:"1rem",
            }}
          >
            <Box id="progress-list-preview-wrap" 
              sx={{
                '& .MuiImageList-root:first-of-type': {
                  gridAutoFlow: "column"
                }
              }}
            >
              <Typography variant="h6">In Progress</Typography>
              <PreviewList medium={progress} />
            </Box>

            <Box id="anime-list-preview-wrap" mt="1em">
              <Typography sx={{textDecoration: "none", color: "inherit"}} component={Link} to={`/user/${user.userName}/animelist`} variant="h6">Animes</Typography>
              <PreviewList medium={user.animes.slice(-6)} />
            </Box>

            <Box id="manga-list-preview-wrap" mt="1em">
              <Typography sx={{textDecoration: "none", color: "inherit"}} component={Link} to={`/user/${user.userName}/mangalist`} variant="h6">Mangas</Typography>
              <PreviewList medium={user.mangas.slice(-6)} />
            </Box>
          </Box>
        </Box>
      
      </Box>
    </Box>
  )
}
