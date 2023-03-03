import React from 'react'
import {Box, Fab, SpeedDial, SpeedDialAction } from '@mui/material';
import {Add, PlayArrow, Check, Schedule, ExpandLess, ExpandMore} from "@mui/icons-material";

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import EditIcon from '@mui/icons-material/Edit';

export default function QuickAction() {
  //Default actions
  const actions = [
    { icon: <Schedule />, name: 'Add to planning' }, //Planning
    { icon: <Check />, name: 'Add to completed' }, //Completed
    { icon: <PlayArrow />, name: 'Add to watching' },//Watching



  ]; 
 
  return (
    <Box sx={{"& .MuiButtonBase-root": {width:"40px", height:"40px"}}}>
       <SpeedDial
        ariaLabel="quick action"
        sx={{ position: 'absolute', bottom: "55px", right: "5px"}}
        icon={<SpeedDialIcon openIcon={<ExpandMore />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {console.log(action.name)}}            
          />
        ))}
      </SpeedDial>
    </Box>
  )
}
