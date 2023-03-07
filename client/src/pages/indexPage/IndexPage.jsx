//Main page for unauthenticated user
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { popularAnimeQuery, trendingAnimeQuery, popularMangaQuery, trendingMangaQuery } from './initalQuery';
import { Grid, CircularProgress, Typography, LinearProgress  } from '@mui/material';
import MediaList from '../../components/MediaList';
import NavBar from '../../components/NavBar';

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
    <div>      
      {(isLoading) ? <LinearProgress /> : 
      <>
      <Typography variant="h5" mr={5} ml={5} >Trending Anime</Typography>
      {!trendingAnime.length ? <CircularProgress/> : 
        <Grid container justifyContent="center" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
          <MediaList media={trendingAnime} />
        </Grid>
       }
      <hr></hr>
      <Typography variant="h5" mr={5} ml={5}>All Time Popular Anime</Typography>
      {!popularAnime.length ? <CircularProgress/> : 
      <Grid container justifyContent="center" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        <MediaList media={popularAnime} />
      </Grid>
      }
      <hr></hr>
      <Typography variant="h5" mr={5} ml={5}>Trending Manga</Typography>
      {!trendingManga.length ? <CircularProgress/> : 
      <Grid container justifyContent="center" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        <MediaList media={trendingManga} />
      </Grid>
      }
      <hr></hr>
      <Typography variant="h5" mr={5} ml={5}>All Time Popular Manga</Typography>
      {!popularManga.length ? <CircularProgress/> : 
      <Grid container justifyContent="center" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        <MediaList media={popularManga} />
      </Grid>
      }
      <hr></hr>
      </>
      }
    </div>
    </>
  )
}
