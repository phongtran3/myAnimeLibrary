import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Box, Typography, useMediaQuery} from "@mui/material";
import axios from 'axios';
import NavBar from '../../components/NavBar'
import ProfileCard from '../../components/ProfileCard'
import ListsFilter from '../../components/ListsFilter';

export default function ListPage() {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const { userName, list } = useParams();
  const token = useSelector((state) => state.token);
  const type = list === 'animelist' ? 'anime' : 'manga'

  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      console.log(res);
      setUser(res);
      //console.log(type);
      setUserList(type === 'anime' ? res.data.animes : res.data.mangas);
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
    console.log(err);
    }) 
  }
  useEffect(() => {
    getUser();
    console.log(user)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }
  const {firstName, lastName, animes, mangas, picturePath } = user.data;
  //const progress = [];
  //const planning = []
  // if (type === 'anime'){
  //     const progress = animes.filter(anime => anime.userStatus === 'WATCHING')
  //     const completed = animes.filter(anime => anime.userStatus === 'COMPLETED')
  //     const planning = animes.filter(anime => anime.userStatus === 'PLANNING')
  //     console.log(progress);
  //     console.log(planning);
  //     console.log(completed);
  // }else{
  //   const progress = mangas.filter(manga => manga.userStatus === 'READING')
  //   const completed = mangas.filter(manga => manga.userStatus === 'COMPLETED')
  //   const planning = mangas.filter(manga => manga.userStatus === 'PLANNING')
  //   console.log(progress);
  //   console.log(planning);
  //   console.log(completed);
  // }

  console.log(user)
  let format = '';
  let genre = ["Romance"];
  let query = ''
  let status = 'FINISHED'
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
            <h1>List Page</h1>
            <ListsFilter />
          </Box>
          <Box id="section-2">
            {userList.filter(
                item => (item.userStatus === 'COMPLETED') && 
                ((genre ? genre.some(v => item.genres.includes(v)) : false) &&
                (format === '' ? true : item.format === format) &&
                (item.title.toLowerCase().includes(query.toLowerCase())) &&
                (status === '' ? true : item.status === status)
                )).map(item => (
              <p key={item._id}>{item.title}, {genre.some(v => item.genres.includes(v)) ? "Romance" : "Not Romance"}</p>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
