import React from 'react'
import { Box } from '@mui/material'
import { TextField } from '@mui/material';
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

    </Box>
  )
}
