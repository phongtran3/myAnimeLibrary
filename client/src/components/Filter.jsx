import React, {useState, useEffect} from 'react'
import { useParams, useSearchParams, useNavigate  } from 'react-router-dom';
import { Box, Button, TextField, Autocomplete, Checkbox, Chip, MenuItem  } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { genreCollection, formatCollection, status } from './FilterCollections';



export default function Filter() {
  const [filter, setFilter] = useState({title: '', format: '', status: '', genres: []});
  const [searchTitle, setSearchTitle] = useState('');
  const [searchFormat, setSearchFormat] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchGenre, setSearchGenre] = useState([]);

  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = params.sort === "trending" ? "TRENDING_DESC" : "POPULARITY_DESC";
  //console.log("sort: " + sort);
  const navigate  = useNavigate();
  const paramSearch = searchParams.get('search');
  //console.log("search: " + paramSearch)
  const paramFormat = searchParams.get('format');
  //console.log("format: " + paramFormat)
  const paramStatus = searchParams.get("status");
  //console.log("status: " + paramStatus);
  const paramGenres = searchParams.getAll('genres');
  //console.log(paramGenres)

  useEffect(() => {
    console.log("Filter useEffect");
    if (paramSearch) setSearchTitle(paramSearch)
    if (paramFormat) setSearchFormat(paramFormat)
    if (paramStatus) setSearchStatus(paramStatus)
    if (paramGenres[0] != "") setSearchGenre(paramGenres)


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
        `/search/anime?genres=${searchGenre.join('&genres=')}&format=${searchFormat}&status=${searchStatus}&search=${searchTitle}&sort=${sort}`,
        
      )
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

        <Autocomplete multiple limitTags={2} id="checkboxes-genres" options={genreCollection} 
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
        <TextField
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
        </TextField>

        {/*AIRING STATUS */}
        <TextField
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          id="outlined-select-status"
          select
          label="Select Status"
          defaultValue=""
          sx={{width: 500}}
        >
          {status.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
 
        <Button onClick={searchMedia} variant="contained" >Filter</Button>
    </Box>
  )
}
