import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { popularAnimeQuery, trendingAnimeQuery, popularMangaQuery, trendingMangaQuery } from './initalQuery';
import { Box, Grid, CircularProgress, Typography, LinearProgress  } from '@mui/material';
import MediaList from '../../components/MediaList';
import NavBar from '../../components/NavBar';
import BrowseFilter from '../../components/BrowseFilter';
import {Link} from 'react-router-dom';



export default function IndexPage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setpopularAnime] = useState([]);
  const [trendingManga, setTrendingManga] = useState([]);
  const [popularManga, setpopularManga] = useState([]);


  const variables = {
    page: 1,
    perPage: 5,
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
    <>
    <NavBar />
    <Box maxWidth="1520px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}> 
      <Box margin="0 2.5rem">
        <BrowseFilter />
      </Box>

      {(isLoading) ? <LinearProgress /> : 
      <>
      {!trendingAnime.length ? <CircularProgress/> : 
        <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '1rem 2.5rem',}}>
          <Typography variant="h5" component={Link} to={`search/anime/trending`} >Trending Anime</Typography>
          <MediaList media={trendingAnime} />
        </Grid>
       }
      <hr></hr>
      
      {!popularAnime.length ? <CircularProgress/> : 
      <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '1rem 2.5rem',}}>
        <Typography variant="h5" component={Link} to={`search/anime/popularity`}>All Time Popular Anime</Typography>
        <MediaList media={popularAnime} />
      </Grid>
      }
      <hr></hr>
      
      {!trendingManga.length ? <CircularProgress/> : 
      <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '1rem 2.5rem',}}>
        <Typography variant="h5" component={Link} to={`search/manga/trending`}>Trending Manga</Typography>
        <MediaList media={trendingManga} />
      </Grid>
      }
      <hr></hr>
      
      {!popularManga.length ? <CircularProgress/> : 
      <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '1rem 2.5rem',}}>
        <Typography variant="h5" component={Link} to={`search/manga/popularity`}>All Time Popular Manga</Typography>
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
