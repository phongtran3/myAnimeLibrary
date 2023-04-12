import React from 'react'
import { Box, Typography, useMediaQuery, TextField, Autocomplete} from "@mui/material";
import { genreCollection, animeFormat, status, mangaFormat, sortCollection } from './FilterCollections';

export default function ListsFilter({type, filters, setFilters}) {
 //console.log(filters);





  function handleNewFormatInput(event, newInputValue){
    let temp;
    if (newInputValue === "TV Show") temp = "TV"
    else if (newInputValue === "TV Short") temp = "TV_SHORT"
    else if (newInputValue === "One Shot") temp = "ONE_SHOT";
    else if (newInputValue === "Light Novel") temp = "NOVEL";
    else temp = newInputValue
    setFilters(prevState => ({
      ...prevState,
      format: temp
    }));
  }

  return (
    <Box>
      <h1>Filter</h1>
      <TextField 
          placeholder='Search...'
          variant="outlined"
          value={filters.query}
          onChange={(e) => {setFilters(prevState =>({
            ...prevState,
            query: e.target.value
          }))}}
      />

      {/*FORMAT */}
      <Autocomplete
          options={type === 'anime' ? animeFormat : mangaFormat}
          getOptionLabel={(option) => option}
          //defaultValue=""
          //value={filters.format ? filters.format : null} 
          //inputValue={filters.format ? filters.format : ""}
          onInputChange={handleNewFormatInput}
          //isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Format" />}
        />


    </Box>
  )
}
