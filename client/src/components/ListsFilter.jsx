import React from 'react'
import { Box, Typography, useMediaQuery, TextField, Autocomplete, Chip} from "@mui/material";
import { genreCollection, animeFormat, status, mangaFormat } from './FilterCollections';

const sortCollection = ["Title", "Last Added"]


export default function ListsFilter({type, filters, setFilters}) {

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
          // sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Format" />}
        />

      {/*STATUS */}
      <Autocomplete
          options={status}
          getOptionLabel={(option) => option}
          //defaultValue=""
          //value={filters.format ? filters.format : null} 
          //inputValue={filters.format ? filters.format : ""}
          onInputChange={(event, newInputValue) => {setFilters(prevState =>({
            ...prevState,
            status: newInputValue
          }))}}
          //isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          // sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Status" />}
        />

        {/*GENRES */}
        <Autocomplete 
          multiple 
          limitTags={2} 
          id="checkboxes-genres" 
          options={genreCollection} 
          //value={searchGenre} 
          onChange={(e, newValue) => {setFilters(prevState => ({
              ...prevState,
              genres: newValue
            }));
          }}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          // sx={{width: 500}}
          renderInput={(params) => (
              <TextField {...params} label={`Select Genre`}/>
          )}
          renderTags={(value, getTagProps) => {
            const numTags = value.length;
            const limitTags = 3;
            return (
              <>
              {value.slice(0, limitTags).map((option, index) => (
                  <Chip
                  {...getTagProps({ index })}
                  key={index}
                  label={option}
                  />
              ))}
              {numTags > limitTags && ` +${numTags - limitTags}`}
              </>
            );
          }}
        />    

      {/*SORT */}
      <Autocomplete
          options={sortCollection}
          getOptionLabel={(option) => option}
          //defaultValue=""
          //value={filters.format ? filters.format : null} 
          //inputValue={filters.format ? filters.format : ""}
          onInputChange={(event, newInputValue) => {setFilters(prevState =>({
            ...prevState,
            sort: newInputValue
          }))}}
          //isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          // sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Sorting" />}
        />
    </Box>
  )
}
