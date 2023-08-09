import React from 'react'
import {SpeedDial, SpeedDialAction } from '@mui/material';
import {PlayArrow, Check, Schedule, ExpandMore} from "@mui/icons-material";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import axios from 'axios';

import { useSelector  } from "react-redux";
// const dispatch = useDispatch();

export default function QuickAction({title, genres, format, coverImage, siteUrl, status, setAlert}) {

  //Default actions
  const actions = [
    { icon: <Schedule />, name: 'Add to planning', value: "PLANNING" }, //Planning
    { icon: <Check />, name: 'Add to completed', value: "COMPLETED" }, //Completed
    { icon: <PlayArrow />, 
      name: format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT' ? 'Add to reading' : 'Add to watching', 
      value: format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT' ? "READING" :"WATCHING" }, //Watching
  ]; 

  const compltedActions = [
    { icon: <Schedule />, name: 'Add to planning', value: "PLANNING" }, //Planning
    { icon: <PlayArrow />, 
      name: format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT' ? 'Add to reading' : 'Add to watching', 
      value: format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT' ? "READING" :"WATCHING" 
    }, //Watching
  ]; 

  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  async function addToList(value, event){
    let list = value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
    event.preventDefault()
    let url;
    if(format === 'MANGA' || format === 'NOVEL' || format === 'ONE_SHOT')
      url = `https://myanimelibrary.onrender.com/manga`
    else
      url = `https://myanimelibrary.onrender.com/anime`
      
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
        console.log(res.data);
        setAlert(`${title} added to ${list} list`)
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
        {status === "NOT_YET_RELEASED" ? 
          <SpeedDialAction
            key={'Add to planning'}
            icon={<Schedule />}
            tooltipTitle={'Add to planning'}
            onClick={(event) => {addToList("PLANNING", event)}}         
          />
        :
          status === "RELEASING" ?
            compltedActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={(event) => {addToList(action.value, event)}}         
              />
            ))
            :
            actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={(event) => {addToList(action.value, event)}}         
              />
            ))
        }
      </SpeedDial>
  )
}


// <SpeedDialAction
//           key={'Add to planning'}
//           icon={<Schedule />}
//           tooltipTitle={'Add to planning'}
//           onClick={(event) => {addToList("PLANNING", event)}}         
//           />