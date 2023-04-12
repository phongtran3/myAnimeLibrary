import React from 'react'
import { Box, Typography, useMediaQuery, TextField} from "@mui/material";
import { genreCollection, animeFormat, status, mangaFormat, sortCollection } from './FilterCollections';

export default function ListsFilter() {




  return (
    <Box>
      <h1>Filter</h1>
      <TextField 
          placeholder='Search...'
          variant="outlined"
          //value={searchTitle}
          //onChange={(e) => {setSearchTitle(e.target.value)}}
      />
    </Box>
  )
}
