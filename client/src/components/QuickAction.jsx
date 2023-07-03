import React from 'react'
import {SpeedDial, SpeedDialAction } from '@mui/material';
import {PlayArrow, Check, Schedule, ExpandMore} from "@mui/icons-material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import axios from 'axios';

import { useSelector  } from "react-redux";
// const dispatch = useDispatch();

export default function QuickAction({title, genres, format, coverImage, siteUrl, status}) {
  //Default actions
  const actions = [
    { icon: <Schedule />, name: 'Add to planning', value: "PLANNING" }, //Planning
    { icon: <Check />, name: 'Add to completed', value: "COMPLETED" }, //Completed
    { icon: <PlayArrow />, 
      name: format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT' ? 'Add to reading' : 'Add to watching', 
      value: format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT' ? "READING" :"WATCHING" }, //Watching
  ]; 
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  async function addToList(value, event){
    event.preventDefault()
    let url;
    if(format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT')
      url = `http://localhost:5000/manga`
    else
      url = `http://localhost:5000/anime`
    const body = {
      "userId": _id,
      "title": title,
      "genres": genres,
      "format": format,
      "coverImage": coverImage,
      "siteUrl": siteUrl,
      "userStatus": value,
      "status": status
    }
    
    await axios.post(url, {data: body}, {headers: { Authorization: `${token}` }},)
    .then(res => {
        console.log("Adding to list");
        console.log(res);
    }).catch(err => {
        if (err.response){
            console.log(err.response.data);
            // setError(err.response.data.message);
        }
        console.log(err);
    })
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
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={(event) => {addToList(action.value, event)}}         
          />
        ))}
      </SpeedDial>
  )
}
