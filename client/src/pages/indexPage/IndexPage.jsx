import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { popularAnimeQuery, trendingAnimeQuery, popularMangaQuery, trendingMangaQuery } from './initalQuery';
import { Box, Grid, CircularProgress, Typography, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import MediaList from '../../components/MediaList';
import NavBar from '../../components/NavBar';
import BrowseFilter from '../../components/BrowseFilter';
import {Link} from 'react-router-dom';



export default function IndexPage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [popularAnime, setpopularAnime] = useState([]);
  const [trendingManga, setTrendingManga] = useState([]);
  const [popularManga, setpopularManga] = useState([]);
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1100px)");

  const { palette } = useTheme();

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
      <Box 
        maxWidth="1520px" 
        margin="2rem auto"
        paddingBottom="1rem"
        sx={{
          "& .MuiTypography-root":{
            display:"flex",
            alignItems:"center",
            textDecoration: "none",
            fontSize: "1.75rem",
            fontWeight: "600",
            color: "#111111",
            "&:hover": {
              color: '#673ab7',
            },
            "& > div":{
              fontSize: "1rem",
              marginLeft: "auto",
            }
          }
        }}
      > 
        <Box margin="0 2rem 2rem">
          <h1>Filter</h1>
          <BrowseFilter />
        </Box>

        {(isLoading) ? <LinearProgress /> : 
        <>
        {!trendingAnime.length ? <CircularProgress/> : 
          <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
            <Typography component={Link} to={`search/anime/trending`}>
              <span>Trending Anime</span>
              <div>View All</div>
            </Typography>
            <MediaList media={trendingAnime} />
          </Box>
        }
        
        {!popularAnime.length ? <CircularProgress/> : 
        <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
          <Typography component={Link} to={`search/anime/popularity`}>
            <span>All Time Popular Anime</span>
            <div>View All</div>
          </Typography>
          <MediaList media={popularAnime} />
        </Box>
        }
        
        {!trendingManga.length ? <CircularProgress/> : 
        <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
          <Typography component={Link} to={`search/manga/trending`}>
            <span>Trending Manga</span>
            <div>View All</div>
          </Typography>
          <MediaList media={trendingManga} />
        </Box>
        }
        
        {!popularManga.length ? <CircularProgress/> : 
        <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
          <Typography component={Link} to={`search/manga/popularity`}>
            <span>All Time Popular Manga</span>
            <div>View All</div>
          </Typography>
          <MediaList media={popularManga} />
        </Box>
        }
        </>
        }
      </Box>
    </Box>
  )
}
