//Navagation bar
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link  } from 'react-router-dom';
import {setMode, setLogout } from '../states/index';
import { 
  AppBar, 
  Box, 
  Typography, 
  Toolbar, 
  Avatar, 
  IconButton,
  Button, 
  useScrollTrigger, 
  Slide, 
  useTheme, 
  DarkMode, 
  LightMode,
  MenuItem,
  Autocomplete,
  TextField
} from '@mui/material';
import {PlayArrow, AutoStories, Logout, Settings, Person } from "@mui/icons-material";
import PopupState, {bindHover, bindMenu} from "material-ui-popup-state";
import HoverMenu from 'material-ui-popup-state/HoverMenu'
import axios from 'axios';

//<IconButton {...bindHover(popupState)}><Avatar sx={{ width: 56, height: 56 }} src={`http://localhost:5000/assets/${user.picturePath}`}/></IconButton>

// function ListboxComponent(props){
//   console.log(props);
//   return (
//     <>
//       <ul {...props} />
//       <Avatar sx={{ width: 56, height: 56 }} src={`http://localhost:5000/assets/${props.picturePath}`}/>
//     </>
//   )
// }



export default function NavBar() {
  const [users, setUsers] = useState([]);
  //const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector((state) => state.user);
  const trigger = useScrollTrigger();

  async function handleChange(search){
    console.log(search);
    // const body = {
    //   "search": JSON.stringify(value)
    // }
    //setSearch(value);
    await axios.get(
      `http://localhost:5000/users/`,
      {params: {"search": search},
      headers: {"Content-Type": "application/json", 'Accept': 'application/json',}},
    ).then(res =>{
      console.log(res.data);
      setUsers(res.data);
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
    console.log(err);
    })
  }
  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar>
          <Toolbar sx={{margin:"0 50px"}}>
            <Typography fontWeight="bold" fontSize="16px" component={Link} to="/">MyAnimeLibrary</Typography>
            <Box display="inline-flex" justifyContent="center" alignItems="center" width="100%" sx={{"& > a": { padding:"0 12px", textDecoration:"none", color:"inherit"}}}> 
              <Box sx={{
                "& > a": { padding:"0 12px", textDecoration:"none", color:"inherit"},
                margin: "0 auto",
                padding: "0 0 0 200px"
              }}>
                {user && (
                  <>
                  <Typography fontWeight="bold" fontSize="16px" component={Link} to={`/user/${user.userName}`} >Profile</Typography>
                  <Typography fontWeight="bold" fontSize="16px" component={Link} onClick={() => {navigate(`/user/${user.userName}/animelist`); navigate(0);}} >Anime List</Typography>
                  <Typography fontWeight="bold" fontSize="16px" component={Link} onClick={() => {navigate(`/user/${user.userName}/mangalist`); navigate(0);}} >Manga List</Typography>
                  </>
                )}
                
                <PopupState variant="popper" popupId="demoPopover">
                    {(popupState) => ( 
                      <>
                        <Typography 
                          fontWeight="bold" 
                          component={Link} 
                          fontSize="16px" 
                          {...bindHover(popupState)} 
                          onClick={() => {
                            navigate("/search/anime"); 
                            navigate(0);
                          }}>
                            Browse
                          </Typography>
                        <HoverMenu {...bindMenu(popupState)} sx={{"& .MuiPaper-root": {width:"175px", padding:"10px"}}}>
                          <Box display="flex" alignItems="center" flexDirection="column">
                            <Box display="flex" alignItems="center">
                              <MenuItem><Typography onClick={() => {navigate("/search/anime"); navigate(0);}} display="flex" ><PlayArrow /></Typography></MenuItem>
                              <MenuItem ><Typography fontWeight="bold" sx={{textDecoration:"none", color:"inherit"}} fontSize="16px" onClick={() => {navigate("/search/anime"); navigate(0);}}>Anime</Typography></MenuItem>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <MenuItem><Typography onClick={() => {navigate("/search/manga"); navigate(0);}} display="flex" ><AutoStories /></Typography></MenuItem>
                              <MenuItem ><Typography fontWeight="bold" sx={{textDecoration:"none", color:"inherit"}} fontSize="16px" onClick={() => {navigate("/search/manga"); navigate(0);}}>Manga</Typography></MenuItem>
                            </Box>
                          </Box>
                        </HoverMenu>
                      </>
                    )}
                  </PopupState>
              </Box>
                {/* <Button variant="contained">
                  <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                </Button> */}

                  <Autocomplete 
                    freeSolo 
                    options={users || []}
                    getOptionLabel={(option) => option.userName}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Avatar src={`http://localhost:5000/assets/${option.picturePath}`}/>&nbsp;{option.userName}
                        
                      </Box>
                    )}
                    size='small'
                    onInputChange={(event) => {handleChange(event.target.value)}}
                    onChange={(event, option) =>{
                      window.location.href = `http://localhost:3000/user/${option.userName}`
                    }}
                    renderInput={(params) => <TextField {...params} label="Search Users" />}
                    sx={{
                      width:"250px",
                      marginRight:"1em",
                      '& .MuiAutocomplete-endAdornment':{ display: "none"},
                      '& .MuiFormLabel-root': {
                        color: "black", 
                      },
                      '& .MuiInputLabel-root.Mui-focused':{
                        color: "black",
                      },
                    }}
                  />
            </Box>
            


            {!user && (
              <Box>
                <Button variant="contained">
                    <Typography fontWeight="bold" fontSize="16px" sx={{color:"white"}} component={Link} to="/auth">Login</Typography>
                  </Button> 
              </Box>
              )}
            {user && (
              <PopupState variant="popper" popupId="demoPopover">
              {(popupState) => ( 
                <>
                  <IconButton {...bindHover(popupState)}><Avatar sx={{ width: 56, height: 56 }} src={`http://localhost:5000/assets/${user.picturePath}`}/></IconButton>
                  <HoverMenu {...bindMenu(popupState)} sx={{"& .MuiPaper-root": {width:"175px", padding:"10px"}}}>
                    <MenuItem onClick={() => {navigate(`/user/${user.userName}`)}}><Person/>&nbsp;Profile</MenuItem>
                    <MenuItem onClick={() => {navigate('/settings')}}><Settings/>&nbsp;Edit Profile</MenuItem>
                    <MenuItem onClick={() => dispatch(setLogout())}><Logout/>&nbsp;Logout</MenuItem>
                  </HoverMenu>
                </>
              )}
            </PopupState>
            )}
            
          </Toolbar>
        </AppBar>
      </Slide>
      <Toolbar />
    </>
  )
}
