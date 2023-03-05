import React from 'react'
import {Box, SpeedDial, SpeedDialAction } from '@mui/material';
import {PlayArrow, Check, Schedule, ExpandLess, ExpandMore} from "@mui/icons-material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import axios from 'axios';

import { useSelector  } from "react-redux";
// const dispatch = useDispatch();

export default function QuickAction({title, genres, format, coverImage, siteUrl}) {
  //Default actions
  const actions = [
    { icon: <Schedule />, name: 'Add to planning', value: "PLANNING" }, //Planning
    { icon: <Check />, name: 'Add to completed', value: "COMPLETED" }, //Completed
    { icon: <PlayArrow />, name: 'Add to watching', value: "WATCHING" }, //Watching
  ]; 
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  async function addToList(value){
    let url;
    if(format === 'MANGA')
      url = `http://localhost:5000/manga`
    else
      url = `http://localhost:5000/anime`
    const body = {
      "userId": _id,
      "title": title,
      "genres": genres,
      "format": format === 'MANGA' ? null : format,
      "coverImage": coverImage,
      "siteUrl": siteUrl,
      "userStatus": value
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
        sx={{ position: 'absolute', bottom: "55px", right: "5px"}}
        icon={<SpeedDialIcon openIcon={<ExpandMore />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => addToList(action.value)}            
          />
        ))}
      </SpeedDial>
  )
}
