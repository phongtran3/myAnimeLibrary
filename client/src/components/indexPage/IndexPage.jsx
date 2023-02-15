//Main page for unauthenticated user
import React, {useState, useEffect} from 'react'
import axios from 'axios';

export default function IndexPage() {
  const [trendingAnime, setTrendingAnime] = useState([]);
  //const [variables, setVariable] = useState({page: 1, perPage: 50});
  //const [viewAll, setViewAll] = useState(false); 
  const query = `
  query ($page: Int, $perPage: Int) {
    Page (page: $page, perPage: $perPage) {
      media(isAdult: false, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  }
  `;
  const variables = {
    page: 1,
    perPage: 50,
  };

  useEffect(() => {
    console.log("UseEffect");
    try{
        const fetchData = async () => {
          axios.post('https://graphql.anilist.co', {
            query,
            variables
          }).then( response => {
            setTrendingAnime(response.data.data.Page.media);
          });
      };
      //const result = fetchData().catch(console.error);
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
      {trendingAnime.map(anime => (
          <img key={anime.id}src={anime.coverImage.large}></img>
        ))}
    </div>
  )
}
