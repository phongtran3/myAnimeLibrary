//Profile page for other users
import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import ProfileCard from '../../components/ProfileCard'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Box, Typography, useMediaQuery, ImageList, ImageListItem , ImageListItemBar } from "@mui/material";


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
      setUser(res);
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
  const {firstName, lastName, animes, mangas, picturePath } = user.data;
  const progress = [];
  for(let i = 0; i < animes.length; i++){
    if(animes[i].userStatus === 'WATCHING')
      progress.push(animes[i])
      
  }
  for(let i = 0; i < mangas.length; i++){
    if(mangas[i].userStatus === 'READING')
      progress.push(mangas[i])
      
  }

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
              firstName={firstName} 
              lastName={lastName} 
              userName={userName} 
              animes={animes} 
              mangas={mangas} 
              picturePath={picturePath} 
            />

          </Box>
          <Box id="section-2">
            <Box id="progress-list-preview-wrap">
              <Typography variant="h6">In Progress</Typography>
              <ImageList cols={6} gap={20} sx={{backgroundColor: "lightblue", textAlign: "center", padding:"15px"}}>
                {progress.map(media => 
                  <ImageListItem key={media._id}>
                    <a href={media.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                      <img
                          src={`${media.coverImage}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${media.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          alt={media.title}
                          loading="lazy"
                          style={{borderRadius: "0.375rem"}}
                          width={"105px"}
                          height={"150px"}
                      />
                    </a>
                  </ImageListItem>
                )}
              </ImageList>
            </Box>
            <Box id="anime-list-preview-wrap" mt="1em">
              <Typography variant="h6">Animes</Typography>
              <ImageList cols={6} gap={20} sx={{backgroundColor: "lightblue", textAlign: "center", padding:"15px"}}>
                {animes.map(anime => 
                  <ImageListItem key={anime._id}>
                    <a href={anime.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                      <img
                          src={`${anime.coverImage}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${anime.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          alt={anime.title}
                          loading="lazy"
                          style={{borderRadius: "0.375rem"}}
                          width={"105px"}
                          height={"150px"}
                      />
                    </a>
                  </ImageListItem>
                )}
              </ImageList>
            </Box>
            <Box id="manga-list-preview-wrap" mt="1em">
              <Typography variant="h6">Manga</Typography>
              <ImageList cols={6} gap={20} sx={{backgroundColor: "lightblue", textAlign: "center", padding:"15px"}}>
                {mangas.map(manga => 
                  <ImageListItem key={manga._id}>
                    <a href={manga.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                      <img
                          src={`${manga.coverImage}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${manga.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          alt={manga.title}
                          loading="lazy"
                          style={{borderRadius: "0.375rem"}}
                          width={"105px"}
                          height={"150px"}
                      />
                    </a>
                  </ImageListItem>
                )}
              </ImageList>
            </Box>
          </Box>
        </Box>
      
      </Box>
    </>
  )
}
