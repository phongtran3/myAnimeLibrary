import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Box, Typography, ImageList, ImageListItemBar, useMediaQuery, Avatar} from "@mui/material";
import axios from 'axios';
import NavBar from '../../components/NavBar'
import ListsFilter from '../../components/ListsFilter';
import Card2 from '../../components/Card2';


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
  const desktopScreen = useMediaQuery("(min-width: 1100px)");

  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      console.log(res.data);
      setUser(res.data);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }
  //const {firstName, lastName, animes, mangas, picturePath } = user.data;
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

  console.log(userList);
  console.log(filters);

  console.log(!(userList[7].userStatus === 'WATCHING' || userList[7].userStatus === 'READING') &&
  ((filters.genres.length === 7 ? true : filters.genres.every(v => userList[7].genres.includes(v))) &&
  (filters.format === "" ? true : userList[7].format === filters.format.toUpperCase()) &&
  (userList[7].title.toLowerCase().includes(filters.query.toLowerCase())) &&
  (filters.status === "" ? true : userList[7].status === filters.status.toUpperCase()) 
  ))

  return (
    <>
      <NavBar />
      <Box id="content-container" 
        sx={{
          maxWidth:"1520px",
          margin:"3rem auto",
          height:"100%",
        }}
      >
        <Box id="content" 
          sx={{
            display: desktopScreen ? "grid" : "block",
            gridTemplateColumns:"calc(30% - 30px) 70%",
            gap:"30px",
            margin:"2rem",

          }}
        >
          <Box id="section-1"
            sx={{
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
             
            }}
          > 
            {/* <h1>Filter</h1> */}
            <a href={`/user/${user.userName}`}><Avatar sx={{ width: 250, height: 250, marginBottom:"1rem"}} src={`http://localhost:5000/assets/${user.picturePath}`}/></a>

            <ListsFilter type={type} filters={filters} setFilters={setFilters} />
          </Box>

          {/* (item.userStatus === 'COMPLETED') &&  */}
          <Box id="section-2">
            <Box className="list-wrapper"
              sx={{

              }}
            >
              <Typography variant='h6'>{type ==='anime' ? "Watching" : "Reading"}</Typography>
              {userList.some(item => item['userStatus'] === 'WATCHING' || item['userStatus'] === 'READING')  &&  
              <>
                <ImageList cols={6} 
                  sx={{
                    textAlign: "center", 
                    gap:"20px 20px !important",
                                        
                  }}>
                  {userList.filter(item => (item.userStatus === 'WATCHING' || item.userStatus === 'READING') &&
                      ((filters.genres.length === 0 ? true : filters.genres.every(v => item.genres.includes(v))) &&
                      (filters.format === '' ? true : item.format === filters.format.toUpperCase()) &&
                      (item.title.toLowerCase().includes(filters.query.toLowerCase())) &&
                      (filters.status === '' ? true : item.status === filters.status.toUpperCase()) 
                      )).sort(function(a,b) {
                        if(filters.sort === 'Title'){
                          return a.title.localeCompare(b.title)
                        }else if (filters.sort === 'Last Added')
                          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        else
                          return a.title.localeCompare(b.title);
                      }).map((item) => (
                          <Card2 user={user} key={item._id} item={item}/>
                      ))
                    }

                  </ImageList>
              </>
              }
            </Box>
            
            <hr></hr>

            <Box className="list-wrapper">
              {userList.some(item => item['userStatus'] === 'COMPLETED')  &&  
              <>
                <Typography variant='h6'>Completed</Typography>
                  <ImageList cols={6} sx={{textAlign: "center", gap:"20px 20px !important" }}>
                    {userList.filter(item => (item.userStatus === 'COMPLETED') &&
                        ((filters.genres.length === 0 ? true : filters.genres.every(v => item.genres.includes(v))) &&
                        (filters.format === '' ? true : item.format === filters.format.toUpperCase()) &&
                        (item.title.toLowerCase().includes(filters.query.toLowerCase())) &&
                        (filters.status === '' ? true : item.status === filters.status.toUpperCase()) 
                        )).sort(function(a,b) {
                          if(filters.sort === 'Title'){
                            return a.title.localeCompare(b.title)
                          }else if (filters.sort === 'Last Added')
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                          else
                            return a.title.localeCompare(b.title);
                        }).map((item) => (
                          <Card2 user={user} key={item._id} item={item}/>
                      ))
                    }
                  </ImageList>
              </>
              }
            </Box>
            
            <hr></hr>
            
            <Box className="list-wrapper">
              {userList.some(item => item['userStatus'] === 'PLANNING')  &&  
              <>
                <Typography variant='h6'>Planning</Typography>
                <ImageList cols={6} sx={{textAlign: "center", gap:"20px 20px !important" }}>
                  {userList.filter(item => (item.userStatus === 'PLANNING') &&
                      ((filters.genres.length === 0 ? true : filters.genres.every(v => item.genres.includes(v))) &&
                      (filters.format === '' ? true : item.format === filters.format.toUpperCase()) &&
                      (item.title.toLowerCase().includes(filters.query.toLowerCase())) &&
                      (filters.status === '' ? true : item.status === filters.status.toUpperCase()) 
                      )).sort(function(a,b) {
                        if(filters.sort === 'Title'){
                          return a.title.localeCompare(b.title)
                        }else if (filters.sort === 'Last Added')
                          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        else
                          return a.title.localeCompare(b.title);
                      }).map((item) => (
                        <Card2 user={user} key={item._id} item={item}/>
                    ))
                  }
                </ImageList>
              </>
              }
            </Box>
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
