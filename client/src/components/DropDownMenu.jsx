import { TextField, Autocomplete, Checkbox, Chip} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import React from 'react'


export default function DropDownMenu({array, name, setter}) {



  return (
    <>
      <Autocomplete 
        multiple
        limitTags={2}
        id="checkboxes-tags-demo"
        options={array}
        // defaultValue={[array[1]]}
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
            <TextField {...params} label={`Select ${name}`}/>
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
    </>
  )
}
