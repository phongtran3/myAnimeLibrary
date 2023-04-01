import React, {useState, useEffect} from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { useParams, useSearchParams, useHistory, useLocation  } from 'react-router-dom';
import { Box } from '@mui/material';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAiringStatus, setSearchAiringStatus] = useState('');
  const [searchFormat, setSearchFormat] = useState('');
  const [searchGenre, setSearchGenre] = useState([]);

  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams();
  // const format = searchParams.get('format')
  // console.log("format: " + format)
  // const status = searchParams.get("status")
  // console.log("status: " + status);
  // const genres = searchParams.getAll('genres');
  // console.log("genres: " + genres)
  // console.log(JSON.stringify(params));
  const sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC";
  const media = params.media;
  // console.log(sort)
  // console.log(media)

  const query = useQuery();
  const search = query.get('search');
  console.log("search: " + search)

  useEffect(() => {
    console.log("SearchPage UseEffect")
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
