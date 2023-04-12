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
  const [filters, setFilters] = useState({
    query: '',
    format:'',
    status: '',
    genres: [],
    sort: ''
  });
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
  console.log(filters);
  let format = '';
  let genre = [];
  let query = ''
  let status = ''
  let sort = 'Last Added'
  //genre.length > 0 ? genre.some(v => item.genres.includes(v)) : true
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
            <ListsFilter type={type} filters={filters} setFilters={setFilters} />
          </Box>
          {/* (item.userStatus === 'COMPLETED') &&  */}
          <Box id="section-2">
            {userList.filter(
                item => 
                ((filters.genres.length === 0 ? true : filters.genres.every(v => item.genres.includes(v))) &&
                (filters.format === '' ? true : item.format === filters.format.toUpperCase()) &&
                (item.title.toLowerCase().includes(filters.query.toLowerCase())) &&
                (filters.status === '' ? true : item.status === filters.status.toUpperCase()) 
                )).sort(function(a,b) {
                  if(filters.sort === 'Title'){
                    return a.title.localeCompare(b.title)
                  }else if (filters.sort === 'Last Added')
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                }).map(item => (
              <p key={item._id}>{item.title}</p>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

// Alphabetical
// if (a.title < b.title) {
//   return -1;
// }
// if (a.title > b.title) {
//   return 1;
// }
// return 0;

// Last added at top
// return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
