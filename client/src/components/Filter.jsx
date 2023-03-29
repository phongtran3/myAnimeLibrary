import React from 'react'
import { Box } from '@mui/material'
import { TextField, Autocomplete, Checkbox,  } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import { genreCollection, formatCollection, airingStatus } from './FilterCollections';
import DropDownMenu from './DropDownMenu';
export default function Filter() {
  return (
    <Box margin="0 2.5rem">
        <h1>Filter</h1>
        <TextField  placeholder='Search...' />
        <DropDownMenu array={genreCollection} name={"Genre"}/>
        <DropDownMenu array={formatCollection} name={"Format"}/>
        <DropDownMenu array={airingStatus} name={"Airing Status"}/>

        {/* <Autocomplete
          multiple
          limitTags={2}
          id="checkboxes-tags-demo"
          options={genreCollection}
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
          sx={{ width: 500 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Genre"/>
          )}
        /> */}
    </Box>
  )
}
