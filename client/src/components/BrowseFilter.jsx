import React, {useState, useEffect} from 'react'
import { useParams, useSearchParams, useNavigate} from 'react-router-dom';
import { Box, Button, TextField, Autocomplete, Chip, Checkbox, useMediaQuery} from '@mui/material'
import { genreCollection, animeFormat, status, mangaFormat, sortCollection } from './FilterCollections';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Filter() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchFormat, setSearchFormat] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchGenre, setSearchGenre] = useState([]);
  const [searchSort, setSearchSort] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate  = useNavigate();
  const params = useParams()
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1100px)");
  

  //console.log(sort);
  const type = params.media ? params.media : 'anime';
  const paramSearch = searchParams.get('search');
  const paramFormat = searchParams.get('format');
  const paramStatus = searchParams.get("status");
  const paramGenres = searchParams.getAll('genres');

  useEffect(() => {
    //console.log("Filter useEffect");
    if (paramSearch) setSearchTitle(paramSearch)
    if (paramFormat) setSearchFormat(paramFormat)
    if (paramStatus) setSearchStatus(paramStatus)
    if (paramGenres[0] !== "") setSearchGenre(paramGenres)
    let sort;
    if (params.sort){
      sort = params.sort.charAt(0).toUpperCase() + params.sort.slice(1);
      setSearchSort(sort);
    } else if (searchParams.get('sort')){
      sort = searchParams.get('sort');
      setSearchSort(sort);
    }

  },[])


  function searchMedia(){
    if(searchTitle.trim() || searchSort.trim() || searchFormat.trim() || searchStatus.trim() || searchGenre.length > 0){
      //console.log("Search Media");
      //console.log(searchTitle);
      //console.log(searchFormat);
      //console.log(searchStatus);
      //console.log(searchGenre);
      console.log(searchSort);

      navigate(
        `/search/${type}?genres=${searchGenre.join('&genres=')}&format=${searchFormat}&status=${searchStatus}&search=${searchTitle}&sort=${searchSort}`,
      )
      navigate(0)
    }else{
      navigate('/');
    }
  }

  return (
    <>
    <Box 
      sx={{
        display: "flex",
        flexWrap:"wrap",
        gap:"1rem 2rem",
        "& > div":{
          flex:"1 0 250px",
          maxWidth: desktopScreen ? "250px" : null,
        },
        "& .MuiInputBase-input, .MuiInputBase-root ":{
          cursor:"pointer",
        }
      }}
    >
        <TextField 
          placeholder='Search...'
          label="Search"
          variant="outlined"
          value={searchTitle}
          onKeyDown={(e) => {if(e.key === 'Enter') searchMedia();}}
          onChange={(e) => {setSearchTitle(e.target.value)}}
        />

        {/* GENRES */}
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
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                id="checkbox-popper"
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 4 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderInput={(params) => (
              <TextField {...params} label={`Select Genre`}/>
          )}
          renderTags={(value, getTagProps) => {
            const numTags = value.length;
            const limitTags = !tabletScreen ? 3 : 1;
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
          options={type === 'anime' ? animeFormat : mangaFormat}
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
          renderInput={(params) => <TextField {...params} label="Select Format" />}
        />
        {/* <TextField
          value={searchFormat}
          onChange={(e) => setSearchFormat(e.target.value)}
          id="outlined-select-format"
          select
          label="Select Format"
          defaultValue=""
        >
          {animeFormat.map((option) => (
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
          renderInput={(params) => <TextField {...params} label="Select Status" />}
        />
        {/* <TextField
          value={searchStatus} 
          onChange={(e) => setSearchStatus(e.target.value)}
          id="outlined-select-status"
          select
          label="Select Status"
          defaultValue=""

        >
          <MenuItem value="">Any</MenuItem>
          {status.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> */}

        {/*Sort */}
        <Autocomplete
          options={sortCollection}
          getOptionLabel={(option) => option}
          defaultValue=""
          value={searchSort ? searchSort : null} 
          inputValue={searchSort ? searchSort : ""}
          onInputChange={(event, newInputValue) => {
            setSearchSort(newInputValue);
          }}
          isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="combo-box-demo"
          renderInput={(params) => <TextField {...params} label="Select Sorting" />}
        />
    </Box>
    <Button 
      sx={{
        backgroundColor:"#7C4CD1",
        marginTop: "1rem", 
        color: "#111111",
        fontWeight:"600",
        "&:hover": {
          backgroundColor: '#b39ddb',
        },
      }} 
      onClick={searchMedia} 
      variant="contained"
     >
      Filter
    </Button>
  </>
  )
}
