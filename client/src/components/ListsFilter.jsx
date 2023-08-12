import React from 'react'
import { Box, TextField, Autocomplete, Chip, useTheme} from "@mui/material";
import { genreCollection, animeFormat, status, mangaFormat } from './FilterCollections';

export default function ListsFilter({type, filters, setFilters}) {
  const sortCollection = ["Title", "Last Added"]
  const { palette } = useTheme();

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
    <Box id="filter"
      sx={{
        width:"100%",
        margin:"1rem",
        display:"flex",
        flexWrap:"wrap",
        gap:"1rem",
        "& > div":{
          flex:"1 0 250px",
          ".MuiInputBase-root":{
            borderRadius: "8px",
          }
        },
        "& .MuiInputBase-input":{
          cursor:"pointer",
        },
        "& .MuiOutlinedInput-notchedOutline":{
          borderWidth:"2px",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: palette.neutral.dark,
        },
        "& .MuiFormLabel-root, .MuiInputBase-root, .MuiInputLabel-root.Mui-focused": {
          color: palette.neutral.dark,
        }
      }}

    >
      <TextField 
          placeholder='Search...'
          label="Search"
          variant="outlined"
          value={filters.query}
          onChange={(e) => {setFilters(prevState =>({
            ...prevState,
            query: e.target.value
          }))}}
      />

      {/*GENRES */}
      <Autocomplete 
        multiple 
        limitTags={2} 
        id="checkboxes-genres" 
        options={genreCollection} 
        //value={searchGenre} 
        value={filters.genres ? filters.genres : null} 
        onChange={(e, newValue) => {setFilters(prevState => ({
            ...prevState,
            genres: newValue
          }));
        }}
        disableCloseOnSelect
        getOptionLabel={(option) => option}
        renderInput={(params) => (
            <TextField {...params} label={`Select Genre`}/>
        )}
        renderTags={(value, getTagProps) => {
          const numTags = value.length;
          const limitTags = 2;
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
        sx={{
          "div > .MuiInputBase-root":{
            paddingRight:"39px !important",
          },
        }}
      />    

      {/*FORMAT */}
      <Autocomplete
          options={type === 'anime' ? animeFormat : mangaFormat}
          getOptionLabel={(option) => option}
          value={filters.format ? filters.format : null} 
          onInputChange={handleNewFormatInput}
          disablePortal
          id="combo-box-demo"
          renderInput={(params) => 
            <TextField {...params} 
              label="Select Format" 
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
            />
          }
        />

      {/*STATUS */}
      <Autocomplete
          options={status}
          getOptionLabel={(option) => option}
          value={filters.status ? filters.status : null} 
          onInputChange={(event, newInputValue) => {setFilters(prevState =>({
            ...prevState,
            status: newInputValue
          }))}}
          disablePortal
          id="combo-box-demo"
          renderInput={(params) => 
            <TextField {...params} 
              label="Select Status" 
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
            />
          }
        />

      {/*SORT */}
      <Autocomplete
          options={sortCollection}
          getOptionLabel={(option) => option}
          value={filters.sort ? filters.sort : null} 
          onInputChange={(event, newInputValue) => {setFilters(prevState =>({
            ...prevState,
            sort: newInputValue
          }))}}
          //isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          renderInput={(params) => 
            <TextField {...params} 
              label="Select Sorting" 
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
            />
          }
        />
    </Box>
  )
}
