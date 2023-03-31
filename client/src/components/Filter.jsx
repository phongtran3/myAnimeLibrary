import React from 'react'
import { Box, Button } from '@mui/material'
import { TextField } from '@mui/material';
import { genreCollection, formatCollection, airingStatus } from './FilterCollections';
import DropDownMenu from './DropDownMenu';


export default function Filter({searchTitle, setSearchTitle, setSearchFormat}) {


  function searchMedia(){
    console.log("Search Media");
    console.log(searchTitle);
  }

  return (
    <Box margin="0 2.5rem">
        <h1>Filter</h1>
        <TextField 
          placeholder='Search...'
          variant="outlined"
          value={searchTitle}
          onKeyDown={(e) => {if(e.key === 'Enter') searchMedia();}}
          onChange={(e) => {setSearchTitle(e.target.value)}}
        />
        
        <DropDownMenu array={genreCollection} name={"Genre"}/>
        <DropDownMenu array={formatCollection} setter={setSearchFormat} name={"Format"}/>
        <DropDownMenu array={airingStatus} name={"Airing Status"}/>
        <Button onClick={searchMedia} variant="contained" >Filter</Button>
    </Box>
  )
}
