import { TextField, Autocomplete, Checkbox,  } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import React from 'react'


export default function DropDownMenu({array, name}) {
  return (
    <>
      <Autocomplete 
        multiple
        limitTags={2}
        id="checkboxes-tags-demo"
        options={array}
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
        sx={{
            "& .MuiAutocomplete-inputRoot": {flexWrap: "nowrap !important"},
            "& .Mui-focused": {flexWrap: "wrap !important"},
            width: 500
        }}
        renderInput={(params) => (
            <TextField {...params} label={`Select ${name}`}/>
        )}
      />
    </>
  )
}
