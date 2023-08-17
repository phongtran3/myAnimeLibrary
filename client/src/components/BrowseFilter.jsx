import React, {useState, useEffect} from 'react'
import { useParams, useSearchParams, useNavigate, useLocation} from 'react-router-dom';
import { Box, Button, TextField, Autocomplete, Chip, useMediaQuery, useTheme} from '@mui/material'
import { genreCollection, animeFormat, statusArr, mangaFormat, sortCollection } from './FilterCollections';

export default function Filter({queryParam}) {
  const params = useParams()
  const navigate  = useNavigate();
  const location = useLocation();
  const { palette } = useTheme();
  const tabletScreen = useMediaQuery("(min-width: 630px)");
  const desktopScreen = useMediaQuery("(min-width: 1150px)");
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { search, status, genres } = queryParam;
  const type =  params.media ? params.media : 'anime';
  const sort = params.sort ? params.sort.charAt(0).toUpperCase() + params.sort.slice(1) : searchParams.get('sort');

  const initialState ={
    search: search || '',
    format: searchParams.get('format') || '',
    status: status || '',
    genres: Array.isArray(genres) && genres[0] !== "" ? genres : [],
    sort: sort ||'',
  }

  const [searchFilters, setSearchFilters] = useState(initialState);

  function searchMedia(){
    let {search, genres, format, status, sort } = searchFilters
    if(search.trim() || sort.trim() || format.trim() || status.trim() || genres.length > 0){
      let url = `/search/${type.toLowerCase()}?genres=${genres.join('&genres=')}&format=${format}&status=${status}&search=${search}&sort=${sort}`;
      let fullPath = decodeURIComponent(`${location.pathname}${location.search}`)
      if(fullPath === url)
        return
      else 
        navigate(url);
    }else{
      if(location.pathname === '/')
        return
      else
        navigate('/');
    }
  }

  useEffect(()=>{
    setSearchFilters(initialState);
  }, [location.search, location.pathname])

  return (
    <>
    <Box 
      sx={{
        display: "flex",
        flexWrap:"wrap",
        gap:"1rem 1.5rem",
        "& > div":{
          flex:"1 0 250px",
          maxWidth: desktopScreen ? "250px" : null,
          borderRadius:"8px",
        },
        "& .MuiInputBase-input, .MuiInputBase-root ":{
          cursor:"pointer",
        },
        "& .MuiOutlinedInput-notchedOutline":{
          borderRadius:"8px",
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
          value={searchFilters.search}
          onKeyDown={(e) => {if(e.key === 'Enter') searchMedia();}}
          onChange={(e) => {
            setSearchFilters(prevFilters => ({
              ...prevFilters,
              search: e.target.value
            }));
          }}
        />

        {/* GENRES */}
        <Autocomplete 
          disablePortal
          multiple 
          limitTags={2} 
          id="genre" 
          options={genreCollection} 
          value={searchFilters.genres} 
          onChange={(e, newValue) => {
            setSearchFilters(prevFilters => ({
              ...prevFilters,
              genres: newValue
            }));
          }}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          sx={{
            "div > .MuiInputBase-root":{
              paddingRight:"39px !important",
            },
          }}
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
                  key={option}
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
          defaultValue=""
          value={searchFilters.format ? searchFilters.format : null} 
          inputValue={searchFilters.format ? searchFilters.format : ""}
          onInputChange={(event, newInputValue) => {
            setSearchFilters(prevFilters => ({
              ...prevFilters,
              format: newInputValue
            }));
          }}
          disablePortal
          id="format"
          renderInput={(params) => 
            <TextField 
              {...params} 
              label="Select Format" 
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
            />
        }
        />

        {/*AIRING STATUS */}
        <Autocomplete
          options={statusArr}
          getOptionLabel={(option) => option}
          defaultValue=""
          value={searchFilters.status ? searchFilters.status : null} 
          inputValue={searchFilters.status ? searchFilters.status : ""}
          onInputChange={(event, newInputValue) => {
            setSearchFilters(prevFilters => ({
              ...prevFilters,
              status: newInputValue
            }));
          }}
          disablePortal
          id="status"
          renderInput={(params) => 
            <TextField 
            {...params} 
            label="Select Status" 
            inputProps={{
              ...params.inputProps,
              readOnly: true,
            }}
            />
          }
        />

        {/*Sort */}
        <Autocomplete
          options={sortCollection}
          getOptionLabel={(option) => option}
          defaultValue=""
          value={searchFilters.sort ? searchFilters.sort : null} 
          inputValue={searchFilters.sort ? searchFilters.sort : ""}
          onInputChange={(event, newInputValue) => {
            setSearchFilters(prevFilters => ({
              ...prevFilters,
              sort: newInputValue
            }));
          }}
          isOptionEqualToValue={(option, value) => option === value}
          disablePortal
          id="sort"
          renderInput={(params) => 
            <TextField 
              {...params} 
              label="Select Sorting"
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }} 
            />
          }
        />
    </Box>

    <Button 
      sx={{
        backgroundColor: palette.primary.main,
        marginTop: "1rem", 
        color: "#fafafa",
        fontWeight:"600",
        "&:hover": {
          backgroundColor: "#7e57c2"
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
