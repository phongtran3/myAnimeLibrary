import React from 'react'
import { Box, Button, TextField, Autocomplete, Checkbox, Chip, RadioGroup, Radio } from '@mui/material'
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
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

        <Autocomplete multiple limitTags={2} id="checkboxes-tags-demo" options={formatCollection} // defaultValue={[array[1]]}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
              <li {...props}>
              <Radio
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
              <TextField {...params} label={`Select Format`}/>
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
        
        {/* <DropDownMenu array={genreCollection} name={"Genre"}/> */}
        {/* <DropDownMenu array={formatCollection} setter={setSearchFormat} name={"Format"}/> */}
        <DropDownMenu array={airingStatus} name={"Airing Status"}/>
        <Button onClick={searchMedia} variant="contained" >Filter</Button>
    </Box>
  )
}
