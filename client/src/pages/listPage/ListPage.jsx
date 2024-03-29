import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { Box, Typography, ImageList, useMediaQuery, Avatar, LinearProgress} from "@mui/material";
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
  const [loading, setLoading] = useState(true);

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

  async function getUser() {
    try {
        const response = await axios.get(
            `https://myanimelibrary.onrender.com/users/${userName}`,
            { headers: { Authorization: token } }
        );
        setUser(response.data);
        const array = type === 'anime' ? response.data.animes : response.data.mangas;
        setWatching(array.filter(item => item.userStatus === (type === 'anime' ? 'WATCHING' : 'READING')));
        setCompleted(array.filter(item => item.userStatus === 'COMPLETED'));
        setPlanning(array.filter(item => item.userStatus === 'PLANNING'));
        setLoading(false);

    } catch (err) {
        if (err.response) {
            console.error(err.response.data);
        }
    }
}

  useEffect(() => {
    setLoading(true);
    getUser();
    setFilters({
      query: '',
      format:'',
      status: '',
      genres: [],
      sort: ''
    })
  }, [list]);

  // useEffect(() =>{
  //   console.log("listPage Render")
  // })

  useEffect(()=>{
    if(user){
      const array = type === 'anime' ? user.animes : user.mangas;
      setWatching(array.filter(item => item.userStatus === (type === 'anime' ? 'WATCHING' : 'READING')));
      setCompleted(array.filter(item => item.userStatus === 'COMPLETED'));
      setPlanning(array.filter(item => item.userStatus === 'PLANNING'));
    }
  }, [user])
 
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
  const watchingArr = returnFilterArray(watching);
  const completedArr = returnFilterArray(completed);
  const planningArr = returnFilterArray(planning);

  if (!user) {
    return null;
  }


  
  return (
    <>
    <Box 
      id="page-content"
      sx={{
        //height:"100%", 
        minHeight:"100vh",
        width:"100%"
      }}
    >
      <NavBar />
      {loading ? (
            <LinearProgress sx={{marginTop:"1rem"}}></LinearProgress>
        ) : (
        <Box id="content-container" 
        sx={{
          maxWidth:"1520px",
          margin:"2rem auto 0 ",
          //height:"100%",
        }}
      >
        <Box id="content" 
          sx={{
            display: desktopScreen ? "grid" : "block",
            gridTemplateColumns:"calc(30% - 30px) 70%",
            gap:"30px",
            margin:"0 2rem",
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
            <a href={`/user/${user.userName}`}><Avatar sx={{ width: 250, height: 250, marginBottom:"1rem"}} src={`${user.picturePath}`}/></a>
            <ListsFilter 
              type={type} 
              filters={filters} 
              setFilters={setFilters} 
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
                  {watchingArr.map(item =>  <Card2 setUser={setUser} user={user} key={item._id} item={item}/>)}
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
                    {completedArr.map(item =>  <Card2 setUser={setUser} user={user} key={item._id} item={item}/>)}
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
                    {planningArr.map(item =>  <Card2 setUser={setUser} user={user} key={item._id} item={item}/>)}
                    </ImageList>
                </>
              </Box>
            }

          </Box>
        </Box>
      </Box>)}
    </Box>
    <Footer/>

  </>
  )
}
