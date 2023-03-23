//Main page for unauthenticated user
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { popularAnimeQuery, trendingAnimeQuery, popularMangaQuery, trendingMangaQuery } from './initalQuery';
import { Box, Grid, CircularProgress, Typography, LinearProgress  } from '@mui/material';
import MediaList from '../../components/MediaList';
import NavBar from '../../components/NavBar';
import Filter from '../../components/Filter';

import { useNavigate, Link  } from 'react-router-dom';
export default function IndexPage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setpopularAnime] = useState([]);
  const [trendingManga, setTrendingManga] = useState([]);
  const [popularManga, setpopularManga] = useState([]);
  //const [variables, setVariable] = useState({page: 1, perPage: 50}); for full search page
  //const [viewAll, setViewAll] = useState(false); 
 
  const variables = {
    page: 1,
    perPage: 5,
  };
 
  useEffect(() => {
    console.log("UseEffect");
    try{
        const fetchData = async () => {
          const getTrendingAnime = axios.post('https://graphql.anilist.co', { query: trendingAnimeQuery, variables })
          const getPopularAnime = axios.post('https://graphql.anilist.co', { query: popularAnimeQuery, variables })
          const getTrendingManga = axios.post('https://graphql.anilist.co', { query: trendingMangaQuery, variables })
          const getPopularManga = axios.post('https://graphql.anilist.co', { query: popularMangaQuery, variables })
          axios.all([getTrendingAnime,getPopularAnime,getTrendingManga,getPopularManga]).then(
            axios.spread((...allData) => {
              setTrendingAnime(allData[0].data.data.Page.media)
              setpopularAnime(allData[1].data.data.Page.media)
              setTrendingManga(allData[2].data.data.Page.media)
              setpopularManga(allData[3].data.data.Page.media)
            })
          )
        }
      fetchData();
    }catch(error){
      console.log("error: " + error.message);
    }
  }, [])

  console.log("index render");
  //console.log(trendingAnime[1]);

  const isLoading = (!trendingAnime.length || !popularAnime.length || !trendingManga.length || !popularManga.length) ? true : false;
  return (
    <>
    <NavBar />
    <Box maxWidth="1440px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>   
      <Filter />
      {(isLoading) ? <LinearProgress /> : 
      <>
      {!trendingAnime.length ? <CircularProgress/> : 
        <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
          <Typography variant="h5" component={Link} to={`search/anime/trending`} >Trending Anime</Typography>
          <MediaList media={trendingAnime} />
        </Grid>
       }
      <hr></hr>
      
      {!popularAnime.length ? <CircularProgress/> : 
      <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        <Typography variant="h5" component={Link} to={`search/anime/popular`}>All Time Popular Anime</Typography>
        <MediaList media={popularAnime} />
      </Grid>
      }
      <hr></hr>
      
      {!trendingManga.length ? <CircularProgress/> : 
      <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        <Typography variant="h5" component={Link} to={`search/manga/trending`}>Trending Manga</Typography>
        <MediaList media={trendingManga} />
      </Grid>
      }
      <hr></hr>
      
      {!popularManga.length ? <CircularProgress/> : 
      <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        <Typography variant="h5" component={Link} to={`search/manga/popular`}>All Time Popular Manga</Typography>
        <MediaList media={popularManga} />
      </Grid>
      }
      <hr></hr>
      </>
      }
    </Box>
    </>
  )
}
