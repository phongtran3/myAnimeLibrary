import React, {useState, useEffect} from 'react'
import { useParams, useSearchParams, useNavigate  } from 'react-router-dom';
import { Box, Button, TextField, Autocomplete, Checkbox, Chip, MenuItem  } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { genreCollection, formatCollection, status } from './FilterCollections';



export default function Filter() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchFormat, setSearchFormat] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchGenre, setSearchGenre] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate  = useNavigate();
  const params = useParams()
  let sort;
  if (params.sort){
    sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC"
  } else if (searchParams.get('sort'))
    sort = searchParams.get('sort');
  else 
    sort = "POPULARITY_DESC"

  console.log(sort);
  const type = params.media ? params.media : 'anime';
  const paramSearch = searchParams.get('search');
  const paramFormat = searchParams.get('format');
  const paramStatus = searchParams.get("status");
  const paramGenres = searchParams.getAll('genres');

  useEffect(() => {
    console.log("Filter useEffect");
    if (paramSearch) setSearchTitle(paramSearch)
    if (paramFormat) setSearchFormat(paramFormat)
    if (paramStatus) setSearchStatus(paramStatus)
    if (paramGenres[0] !== "") setSearchGenre(paramGenres)
  },[])


  function searchMedia(){
    if(searchTitle.trim() || searchFormat.trim() || searchStatus.trim() || searchGenre.length > 0){
      console.log("Search Media");
      console.log(searchTitle);
      console.log(searchFormat);
      console.log(searchStatus);
      console.log(searchGenre);
      //history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
      navigate(
        `/search/${type}?genres=${searchGenre.join('&genres=')}&format=${searchFormat}&status=${searchStatus}&search=${searchTitle}&sort=${sort}`,
      )
      navigate(0)
    }else{
      navigate('/');
    }
  }

  return (
    <Box >
        <h1>Filter</h1>
        <TextField 
          placeholder='Search...'
          variant="outlined"
          value={searchTitle}
          onKeyDown={(e) => {if(e.key === 'Enter') searchMedia();}}
          onChange={(e) => {setSearchTitle(e.target.value)}}
        />

        <Autocomplete 
          multiple 
          limitTags={2} 
          id="checkboxes-genres" 
          options={genreCollection} 
          value={searchGenre} 
          onChange={(e, newValue) => {
            setSearchGenre(newValue);
          }}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          sx={{width: 500}}
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

        {/*FORMAT */}
        <Autocomplete
          options={formatCollection}
          getOptionLabel={(option) => option}
          //freeSolo
          defaultValue=""
          value={searchFormat ? searchFormat : null} 
          // onChange={(e, newValue) => {
          //   setSearchFormat(newValue);
          // }}
          inputValue={searchFormat ? searchFormat : ""}
          onInputChange={(event, newInputValue) => {
            setSearchFormat(newInputValue);
          }}
          isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Format" />}
        />
        {/* <TextField
          value={searchFormat}
          onChange={(e) => setSearchFormat(e.target.value)}
          id="outlined-select-format"
          select
          label="Select Format"
          defaultValue=""
          sx={{width: 500}}
        >
          {formatCollection.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> */}

        {/*AIRING STATUS */}
        <Autocomplete
          options={status}
          getOptionLabel={(option) => option}
          //freeSolo
          defaultValue=""
          value={searchStatus ? searchStatus : null} 
          // onChange={(e, newValue) => {
          //   setSearchStatus(newValue);
          // }}
          inputValue={searchStatus ? searchStatus : ""}
          onInputChange={(event, newInputValue) => {
            setSearchStatus(newInputValue);
          }}

          isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          sx={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Select Status" />}
        />
        {/* <TextField
          value={searchStatus} 
          onChange={(e) => setSearchStatus(e.target.value)}
          id="outlined-select-status"
          select
          label="Select Status"
          defaultValue=""
          sx={{width: 500}}

        >
          <MenuItem value="">Any</MenuItem>
          {status.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> */}
 
        <Button onClick={searchMedia} variant="contained" >Filter</Button>
    </Box>
  )
}
