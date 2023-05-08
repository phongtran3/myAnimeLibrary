//Profile page for other users
import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import ProfileCard from '../../components/ProfileCard'
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { Box, Typography, useMediaQuery} from "@mui/material";
import PreviewList from '../../components/PreviewList';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const { userName } = useParams();
  const token = useSelector((state) => state.token);

  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      //console.log(res);
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
  console.log(user)
  return (
    <>
      <NavBar />
      <Box id="content-container" margin="3em auto 0" maxWidth="1520px" padding="0 50px">
        <Box id="content" 
          display="grid"
          gridTemplateColumns= "calc(40% - 30px) 60%"
          gap="30px"
        >
        
          <Box id="section-1"> 
            {/* will rename id later */}
            <ProfileCard 
              user={user}
              setUser={setUser}
            />
          </Box>
          {/* grid-auto-columns: minmax(8rem, auto);
          grid-auto-flow: column; */}
          <Box id="section-2" >
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
    </>
  )
}
