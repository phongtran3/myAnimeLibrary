import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { popularAnimeQuery, trendingAnimeQuery, popularMangaQuery, trendingMangaQuery } from './initalQuery';
import { Box, ImageList, Typography, LinearProgress, useTheme, Alert, Snackbar} from '@mui/material';
//import MediaList from '../../components/MediaList';
import NavBar from '../../components/NavBar';
import BrowseFilter from '../../components/BrowseFilter';
import Card from '../../components/Card';
import {Link} from 'react-router-dom';
import { useSelector } from "react-redux";

export default function IndexPage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setpopularAnime] = useState([]);
  const [trendingManga, setTrendingManga] = useState([]);
  const [popularManga, setpopularManga] = useState([]);
  const [alert, setAlert] = useState("");

  const { palette } = useTheme();
  const mode = useSelector((state) => state.mode);

  const variables = {
    page: 1,
    perPage: 6,
  };
 
  useEffect(() => {
    try{
        const fetchData = async () => {
          //All requests made to the AniList GraphQL API must be made as a POST request to 'https://graphql.anilist.co'.
          const getTrendingAnime = await axios.post('https://graphql.anilist.co', { query: trendingAnimeQuery, variables })
          const getPopularAnime = await axios.post('https://graphql.anilist.co', { query: popularAnimeQuery, variables })
          const getTrendingManga = await axios.post('https://graphql.anilist.co', { query: trendingMangaQuery, variables })
          const getPopularManga = await axios.post('https://graphql.anilist.co', { query: popularMangaQuery, variables })
          Promise.all([getTrendingAnime,getPopularAnime,getTrendingManga,getPopularManga])
            .then(res => {
              setTrendingAnime(res[0].data.data.Page.media)
              setpopularAnime(res[1].data.data.Page.media)
              setTrendingManga(res[2].data.data.Page.media)
              setpopularManga(res[3].data.data.Page.media)
            })
            .catch(err =>{
              console.log(err)
            })
        }
      fetchData();
    }catch(error){
      console.log("error: " + error.message);
    }
  }, [])

  console.log("index render");
  //console.log(trendingAnime[1]);

  const isLoading = (!trendingAnime.length && !popularAnime.length && !trendingManga.length && !popularManga.length) ? true : false;
  if (isLoading) return <LinearProgress />
  return (
    <Box>
      <NavBar />
      <Snackbar 
          id="snackbar"
          open={alert !== "" ? true : false} 
          autoHideDuration={3000}
          sx={{
            top:"5rem !important",
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={(e,reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setAlert("")
          }}
        >
          <Alert 
            onClose={(e,reason) => {
              if (reason === 'clickaway') {
                return;
              }
              setAlert("")
            }} 
            severity="success" 
            sx={{ width: '100%' }}
        >
          {alert}
        </Alert>
        </Snackbar>

      <Box 
        id="content"
        sx={{
          maxWidth:"1520px",
          margin:"2rem auto",
          paddingBottom:"1rem",
          "& .MuiTypography-root":{
            display:"flex",
            alignItems:"center",
            textDecoration: "none",
            fontSize: "1.75rem",
            fontWeight: "600",
            color: palette.neutral.dark,
            "&:hover": {
              color: palette.primary.main,
            },
            "& > div":{
              fontSize: "1rem",
              marginLeft: "auto",
            }
          }

        }}
      > 
        <Box id="filter-wrapper" margin="0 2rem 2rem">
          <BrowseFilter />
        </Box>

        {(isLoading) ? <LinearProgress /> : 
        <Box 
          id="search-content"
          sx={{
            '@media (max-width: 545px)': {
              ".MuiTypography-root":{
                "span":{
                  fontSize:"1rem",
                },
                "div":{
                  fontSize:".75rem",
                }
              }
            },
            "& div > ul":{
              //background:"red" //test
              overflowY: "visible !important",
              textAlign: "center",
              marginTop: "0.5rem",
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))!important',
              '@media (max-width: 545px)': {
                gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))!important',
              },
              gap:"25px !important" ,
              "a:nth-of-type(5)": {
                '@media only screen and (min-width: 1020px) and (max-width: 1265px)':{
                  display: "none"
                }
              },
              "a:nth-of-type(6)": {
                '@media only screen and (min-width: 1020px) and (max-width: 1510px)':{
                  display: "none"
                }
              },
            }
          }}
        >
          <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
            <Typography component={Link} to={`search/anime/trending`}>
              <span>Trending Anime</span>
              <div>View All</div>
            </Typography>
            {/* <MediaList setAlert={setAlert} media={trendingAnime} /> */}
            <ImageList>
              {trendingAnime.map(anime => {
                return <Card key={anime.id} type={"anime"} mode={mode} setAlert={setAlert} item={anime} />
              })}
            </ImageList>
          </Box>

          <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
            <Typography component={Link} to={`search/anime/popularity`}>
              <span>All Time Popular Anime</span>
              <div>View All</div>
            </Typography>
            {/* <MediaList setAlert={setAlert} media={trendingAnime} /> */}
            <ImageList>
              {popularAnime.map(anime => {
                return <Card key={anime.id} type={"anime"} mode={mode} setAlert={setAlert} item={anime} />
              })}
            </ImageList>
          </Box>

          <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
            <Typography component={Link} to={`search/manga/trending`}>
              <span>Trending Manga</span>
              <div>View All</div>
            </Typography>
            {/* <MediaList setAlert={setAlert} media={trendingAnime} /> */}
            <ImageList>
              {trendingManga.map(anime => {
                return <Card key={anime.id} type={"manga"} mode={mode} setAlert={setAlert} item={anime} />
              })}
            </ImageList>
          </Box>
          
          <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
            <Typography component={Link} to={`search/manga/popularity`}>
              <span>All Time Popular Manga</span>
              <div>View All</div>
            </Typography>
            {/* <MediaList setAlert={setAlert} media={trendingAnime} /> */}
            <ImageList>
              {popularManga.map(anime => {
                return <Card key={anime.id} type={"manga"} mode={mode} setAlert={setAlert} item={anime} />
              })}
            </ImageList>
          </Box>
        </Box>
        }
      </Box>
    </Box>
  )
}
