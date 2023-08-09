import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Box, Typography, ImageList, useMediaQuery, Avatar} from "@mui/material";
import axios from 'axios';
import NavBar from '../../components/NavBar'
import ListsFilter from '../../components/ListsFilter';
import Card2 from '../../components/Card2';
import Footer from '../../components/Footer';

export default function ListPage() {
  const [user, setUser] = useState(null);
  const [watching, setWatching] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [planning, setPlanning] = useState([]);

  const [filters, setFilters] = useState({
    query: '',
    format:'',
    status: '',
    genres: [],
    sort: ''
  });
  //const [userList, setUserList] = useState([]);
  const { userName, list } = useParams();
  const token = useSelector((state) => state.token);
  const type = list === 'animelist' ? 'anime' : 'manga'
  const desktopScreen = useMediaQuery("(min-width: 1100px)");

  async function getUser(){
    await axios.get(
      `https://myanimelibrary.onrender.com/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      console.log(res.data);
      setUser(res.data);
      //console.log(type);
      if (type === 'anime'){
        setWatching(res.data.animes.filter(anime => anime.userStatus === 'WATCHING'))
        setCompleted(res.data.animes.filter(anime => anime.userStatus === 'COMPLETED'))
        setPlanning(res.data.animes.filter(anime => anime.userStatus === 'PLANNING'))
      }else{
        setWatching(res.data.mangas.filter(manga => manga.userStatus === 'READING'))
        setCompleted(res.data.mangas.filter(manga => manga.userStatus === 'COMPLETED'))
        setPlanning(res.data.mangas.filter(manga => manga.userStatus === 'PLANNING'))
      }
      //setUserList(type === 'anime' ? res.data.animes : res.data.mangas);
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

  function returnFilterArray(array){
    return array.filter(item => (
      (filters.status === "" ? true : item.status === filters.status.toUpperCase()) && 
      (filters.format === "" ? true : item.format === filters.format.toUpperCase()) &&
      (filters.genres.length === 0 ? true : filters.genres.every(v => item.genres.includes(v))) &&
      (item.title.toLowerCase().includes(filters.query.toLowerCase()))
      )).sort(function(a,b) {
        if(filters.sort === 'Title'){
          return a.title.localeCompare(b.title)
        }else if (filters.sort === 'Last Added')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        else
          return a.title.localeCompare(b.title);
      })
  }
  //console.log(userList);
  //console.log(filters);

  const watchingArr = returnFilterArray(watching);
  const completedArr = returnFilterArray(completed);
  const planningArr = returnFilterArray(planning);

  return (
    <Box>
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
            //paddingBottom:"1rem",
          }}
        >
          <Box id="section-1"
            sx={{
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
             
            }}
          > 
            <a href={`/user/${user.userName}`}><Avatar sx={{ width: 250, height: 250, marginBottom:"1rem"}} src={`https://myanimelibrary.onrender.com/assets/${user.picturePath}`}/></a>
            <ListsFilter 
              type={type} 
              filters={filters} 
              setFilters={setFilters} 
              setCompleted={setCompleted} 
              setWatching={setWatching} 
              setPlanning={setPlanning}
            />
          </Box>

          <Box id="section-2"
            sx={{
              padding:"0 1rem",
              "& > div":{
                ":not(:last-child)": {marginBottom:"1.5rem",},
                "& > h6":{
                  marginBottom:"1rem",
                },
                "& .MuiImageList-root ":{
                  gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr)) !important",
                  '@media (max-width: 510px)': {
                    gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))!important',
                  },
                },
                "& .MuiImageListItemBar-titleWrap":{
                  padding:"0.5rem",
                }
              }
            }}
          >
            {watchingArr.length > 0 &&
            <Box className="list-wrapper">
              <Typography variant='h6'>{type ==='anime' ? "Watching" : "Reading"}</Typography>
              <>
                <ImageList
                  sx={{
                    textAlign: "center", 
                    gap:"20px !important"
                    
                  }}
                >
                  {watchingArr.map(item =>  <Card2 user={user} key={item._id} item={item}/>)}
                  </ImageList>
              </>
            </Box>
            }

            {completedArr.length > 0 &&
              <Box className="list-wrapper">
                <Typography variant='h6'>Completed</Typography>
                <>
                  <ImageList
                    sx={{
                      textAlign: "center", 
                      gap:"20px !important"
                    }}
                  >
                    {completedArr.map(item =>  <Card2 user={user} key={item._id} item={item}/>)}
                    </ImageList>
                </>
              </Box>
            }
            
            {planningArr.length > 0 &&
              <Box className="list-wrapper">
                <Typography variant='h6'>Planning</Typography>
                <>
                  <ImageList
                    sx={{
                      textAlign: "center", 
                      gap:"20px !important"
                    }}
                  >
                    {planningArr.map(item =>  <Card2 user={user} key={item._id} item={item}/>)}
                    </ImageList>
                </>
              </Box>
            }

          </Box>
        </Box>
      </Box>
      <Footer/>
    </Box>
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
