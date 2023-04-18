import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import {Formik} from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone"; //File/image upload

import { Box, useTheme, Typography, Input, OutlinedInput, TextField, Alert, InputAdornment, IconButton, Button } from '@mui/material'
import {Person, AccountCircle, Email, Lock, Visibility, VisibilityOff, EditOutlined, Clear} from "@mui/icons-material"


export default function SettingPage() {
  const [user, setUser] = useState(null);
  const [newUserName, setNewUserName] = useState("")
  const [files, setFiles] = useState([]);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { palette  } = useTheme();
  const token = useSelector((state) => state.token);
  const userName = useSelector((state) => state.user.userName);
  const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleShowNewConfirmPassword = () => setShowNewConfirmPassword(!showNewConfirmPassword);


  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      //console.log(res);
      setUser(res.data);
      setNewUserName(res.data.userName)
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
    console.log(err);
    }) 
  }

  useEffect(() => {
    getUser();

    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return 
  }

  console.log(user);
  
  async function handleSaveFunction(attribute, value){
    console.log(attribute)
    console.log(value)
    const body = {
      [attribute]: value
    }
    console.log(body)

    await axios.patch(
      `http://localhost:5000/users/${user._id}/update`, 
      {data: attribute}, 
      {headers: { Authorization: `${token}`}}
    ).then(res =>{

    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
          // setError(err.response.data.message);
      }
      console.log(err);
    })

  }

  
  console.log(newUserName)
  return (
    <>
    <NavBar />
    <Box maxWidth="1520px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>
      <Box sx={{ borderRadius: "4px", padding: "20px", background: "mediumpurple" }} >
        <Typography variant='h4' sx={{  color: "white", display: "flex",  justifyContent:"center", marginBottom:"10px"  }}>Edit Profile</Typography>
        <Box className="userName-section">
          <Typography variant='h6'>User Name</Typography>
          <OutlinedInput 
            //defaultValue={user.userName}
            value={newUserName} 
            onChange={(e)=>{
              // if (e.key === 'Space') e.preventDefault()
              setNewUserName(e.target.value.split(" ").join(""))
            }}
          />

          {newUserName != user.userName ? <Button variant='contained' name="userName" onClick={(e)=>{handleSaveFunction(e.target.name, newUserName)}}>Save Username</Button> : ""}
        </Box>
        <Box className="name-section">
          <Typography variant='h6'>First Name</Typography>
          <OutlinedInput defaultValue={user.firstName}/>
        </Box>
      </Box>
    </Box>
    </>
  )
}
