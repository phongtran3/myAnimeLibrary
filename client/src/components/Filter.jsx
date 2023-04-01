import React, {useState} from 'react'
import { useParams, useSearchParams, useHistory, useLocation  } from 'react-router-dom';

import { Box, Button, TextField, Autocomplete, Checkbox, Chip, MenuItem  } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { genreCollection, formatCollection, airingStatus } from './FilterCollections';


export default function Filter() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchFormat, setSearchFormat] = useState('');
  const [searchAiringStatus, setSearchAiringStatus] = useState('');


  function searchMedia(){
    console.log("Search Media");
    console.log(searchTitle);
    console.log(searchFormat);
    console.log(searchAiringStatus);
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

        <Autocomplete multiple limitTags={2} id="checkboxes-tags-demo" options={genreCollection} // defaultValue={[array[1]]}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
            <Checkbox
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                style={{ marginRight: 4 }}
                checked={selected}
            />
            {option}
            </li>
          )}
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
          id="outlined-select-status"
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
          value={searchAiringStatus}
          onChange={(e) => setSearchAiringStatus(e.target.value)}
          id="outlined-select-status"
          select
          label="Select Airing Status"
          defaultValue=""
          sx={{width: 500}}
        >
          {airingStatus.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
 
        <Button onClick={searchMedia} variant="contained" >Filter</Button>
    </Box>
  )
}
