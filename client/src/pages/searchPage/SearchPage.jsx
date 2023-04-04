import React, {useState} from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { Box } from '@mui/material';
import useAniMangaSearch from './useAniMangaSearch';


export default function SearchPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const {loading, hasNextPage, aniManga} = useAniMangaSearch(pageNumber);

  console.log(aniManga);
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
