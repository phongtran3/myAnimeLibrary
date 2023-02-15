//Main page for unauthenticated user
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { popularAnimeQuery, trendingAnimeQuery, popularMangaQuery, trendingMangaQuery } from './initalQuery';
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


  return (
    <div>
      <h1>Index Page</h1>
      <h3>Trending Anime</h3>
      {trendingAnime.map(anime => (
          <img key={anime.id}src={anime.coverImage.large} alt={anime.title.english}></img>
        ))}
      <hr></hr>
      <h3>Popular Anime</h3>
      {popularAnime.map(anime => (
          <img key={anime.id}src={anime.coverImage.large} alt={anime.title.english}></img>
        ))}
      <hr></hr>
      <h3>Trending Manga</h3>
      {trendingManga.map(manga => (
          <img key={manga.id}src={manga.coverImage.large} alt={manga.title.english}></img>
        ))}
      <hr></hr>
      <h3>Popular Manga</h3>
      {popularManga.map(manga => (
          <img key={manga.id}src={manga.coverImage.large} alt={manga.title.english}></img>
        ))}
      <hr></hr>
    </div>
  )
}
