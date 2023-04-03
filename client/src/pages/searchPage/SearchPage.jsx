import React, {useState, useEffect} from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { useParams, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import axios from 'axios';

export default function SearchPage() {
  
  const params = useParams()
  let format;
  const [searchParams, setSearchParams] = useSearchParams();
  const paramSearch = searchParams.get('search').toUpperCase();
  const paramFormat = searchParams.get('format').toUpperCase();
  if (paramFormat === 'TV SHOW') format = 'TV'
  const paramStatus = searchParams.get("status").toUpperCase();
  const paramGenres = searchParams.getAll('genres');
  const sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC";
  const media = params.media.toUpperCase();
  console.log (paramGenres);
  console.log (paramFormat);
  
  const variables = {
    page: 1,
    perPage: 50,
    genre_in: paramGenres,
  };

  useEffect(() => {
    console.log("SearchPage UseEffect")
    const query = `
      query ($page: Int, $perPage: Int, ${paramGenres.length > 1 ? `$genre_in: [String]`: ""}) {
        Page (page: $page, perPage: $perPage) {
          media(
            ${paramGenres.length > 1 ? `genre_in: $genre_in`: ""},
            type: ${media}, 
            sort: ${sort}, 
            ${paramSearch ? `search: ${paramSearch}` : ""} 
            ${paramFormat ? `format: ${format}` : ""} 
            ${paramStatus ? `status: ${paramStatus}` : ""} 
          ) {
              id
              title {
                romaji
                english
              }
              genres
              coverImage {
                large
              }
              siteUrl
              format
              status
              averageScore
              duration
              episodes
            }
        }
      }
    `;
    const fetchData = async () => { 
      await axios.post('https://graphql.anilist.co', { query, variables })
        .then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })
    }
    fetchData();
  },[])

  return (
    <>
      <NavBar />
      <Box maxWidth="1440px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>
        <Box margin="0 2.5rem">
          <Filter />
        </Box>
      </Box>
    </>
  )
}
