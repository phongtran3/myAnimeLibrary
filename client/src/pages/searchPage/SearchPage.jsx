import React, {useState, useEffect} from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { useParams, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';

export default function SearchPage() {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams();
  const paramSearch = searchParams.get('search');
  const paramFormat = searchParams.get('format');
  const paramStatus = searchParams.get("status");
  const paramGenres = searchParams.getAll('genres');
  const sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC";
  const media = params.media;

  const variables = {
    page: 1,
    perPage: 5,
    search: paramSearch,
    genre_in: paramGenres
  };

  useEffect(() => {
    console.log("SearchPage UseEffect")
    const query = `
      query ($page: Int, $perPage: Int, $search: String, $genre_in: [String]) {
        Page (page: $page, perPage: $perPage) {
          media(
            type: ${media}, 
            ${paramFormat ? `format: ${paramFormat}` : ""} 
            sort: ${sort}, 
            search: $search, 
            genre_in: $genre_in
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
