import React from 'react'
import {SpeedDial, SpeedDialAction } from '@mui/material';
import {PlayArrow, Check, Schedule, ExpandMore} from "@mui/icons-material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import axios from 'axios';
import { useSelector  } from "react-redux";
const BASE_URL = "https://myanimelibrary.onrender.com";


export default function QuickAction({title, genres, format, coverImage, siteUrl, status, setAlert}) {
  //Default actions
  const actions = [
    { icon: <Schedule />, name: 'Add to planning', value: "PLANNING" },
    { icon: <Check />, name: 'Add to completed', value: "COMPLETED", condition: status !== "RELEASING" },
    { 
      icon: <PlayArrow />, 
      name: format.match(/MANGA|NOVEL|ONE_SHOT/) ? 'Add to reading' : 'Add to watching',
      value: format.match(/MANGA|NOVEL|ONE_SHOT/) ? "READING" : "WATCHING" 
    }
  ]; 

  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  async function addToList(value, event){
    event.preventDefault()
    const endpoint = format.match(/MANGA|NOVEL|ONE_SHOT/) ? "manga" : "anime";
    const url = `${BASE_URL}/${endpoint}`;
    const body = {
      userId: _id,
      title,
      genres,
      format,
      coverImage,
      siteUrl,
      userStatus: value,
      status
    };

    try {
      await axios.post(url, { data: body }, {
        headers: {
          Authorization: `${token}`
        }
      });
      const listName = value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
      setAlert(`${title} added to ${listName} list`);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
      }
    }
  }

  return (
       <SpeedDial
        ariaLabel="quick action"
        sx={{ 
          position: 'absolute', 
          bottom: "50px", 
          right: "0px",
          "& .MuiButtonBase-root":{
            width:"40px",
            height:"40px"
          },
          "& .MuiSpeedDial-actions":{
            paddingBottom:"40px",
          }
        }}
        icon={<SpeedDialIcon openIcon={<ExpandMore />} />}
        onClick={(e)=>{e.preventDefault()}}
      >
        {status === "NOT_YET_RELEASED" ? 
          <SpeedDialAction
            key={'Add to planning'}
            icon={<Schedule />}
            tooltipTitle={'Add to planning'}
            onClick={(event) => {addToList("PLANNING", event)}}         
          />
        :
        actions.map((action) => (
          (!action.condition || action.condition) &&
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(event) => { addToList(action.value, event) }}
          />
        ))
        }
      </SpeedDial>
  )
}