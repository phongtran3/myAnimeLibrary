//Profile page for other users
import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import ProfileCard from '../../components/ProfileCard'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { Box, useMediaQuery } from "@mui/material";


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

  return (
    <>
      <NavBar />
      <h1>ProfilePage</h1>

      <Box>
        <ProfileCard 
          user={user} 
          lastName={lastName} 
          userName={userName} 
          animes={animes} 
          mangas={mangas} 
          picturePath={picturePath} 
        />

      </Box>
    </>
  )
}
