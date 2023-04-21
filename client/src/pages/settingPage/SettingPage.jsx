import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSiteUser } from '../../states/index';

import axios from 'axios';
import {Formik} from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone"; //File/image upload

import { Box, useTheme, Typography, OutlinedInput, Dialog, TextField, Alert, InputAdornment, IconButton, Button } from '@mui/material'
import ConfirmPassword from '../../components/ConfirmPassword';
//import {Person, AccountCircle, Email, Lock, Visibility, VisibilityOff, EditOutlined, Clear} from "@mui/icons-material"


export default function SettingPage() {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState({
    attribute:"",
    value:"",
    currentPassword: "",
  })
  const [user, setUser] = useState(null);
  // const [currentPassword, setCurrentPassword] = useState("");
  const [newUserName, setNewUserName] = useState("")
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [files, setFiles] = useState([]);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { palette  } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const userName = useSelector((state) => state.user.userName);
  const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleShowNewConfirmPassword = () => setShowNewConfirmPassword(!showNewConfirmPassword);


  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      console.log(res);
      setUser(res.data);
      setNewUserName(res.data.userName);
      setNewFirstName(res.data.firstName);
      setNewLastName(res.data.lastName);
      setNewEmail(res.data.email);
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

  function handleOpenPopover(attribute, value){
    setBody({
      attribute: attribute,
      value: value
    })
    setOpen(true);
  }

  function handleClose(e){
    setOpen(false);
    setBody({
      attribute:"",
      value:""
    })
  }

  console.log(user);

  async function handleSave(attribute, value){
    console.log(body);
    console.log("current password: " + body.currentPassword);

    await axios.patch(
      `http://localhost:5000/users/${user._id}/update`, 
      {data: body}, 
      {headers: { Authorization: `${token}`}}
    ).then(res =>{
      console.log(res);
      setUser(res.data)
      dispatch(setSiteUser({
        user: res.data,
        token: token,
      }))
      setOpen(false);
      setBody({
      attribute:"",
      value:""
      })
      //window.location.reload();
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
        setError(err.response.data.message);
      }
      console.log(err);
    })
    
  }
  
  return (
    <>
    <NavBar />
    <Box maxWidth="1520px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>
      <Box sx={{ borderRadius: "4px", padding: "20px", background: "mediumpurple" }} >
        <Typography variant='h4' sx={{  color: "white", display: "flex",  justifyContent:"center", marginBottom:"10px"  }}>Edit Profile</Typography>
        
        <Box className="userName-section">
          <Typography variant='h6'>User Name</Typography>
          <OutlinedInput 
            value={newUserName} 
            onChange={(e)=>{
              // if (e.key === 'Space') e.preventDefault()
              setNewUserName(e.target.value.split(" ").join(""))
            }}
          />
          {/* {newUserName !== user.userName ? <Button variant='contained' name="userName" onClick={(e)=>{handleSave(e.target.name, newUserName)}}>Save Username</Button> : ""} */}
          {newUserName !== user.userName ? <Button variant='contained' name="userName" onClick={(e)=>handleOpenPopover(e.target.name, newUserName)}>Save Username</Button> : ""}
          <ConfirmPassword 
            open={open} 
            error={error}
            handleClose={handleClose} 
            setBody={setBody}
            handleSave={handleSave}
          />
        </Box>


        {/* <Box className="name-section">
          <Typography variant='h6'>First Name</Typography>
          <OutlinedInput 
            value={newFirstName}
            onChange={(e)=>{
              // if (e.key === 'Space') e.preventDefault()
              setNewFirstName(e.target.value.split(" ").join(""))
            }}
          />
          {newFirstName !== user.firstName ? <Button variant='contained' name="firstName" onClick={(e)=>{handleSave(e.target.name, newFirstName)}}>Save First Name</Button> : ""}

          <Typography variant='h6'>Last Name</Typography>
          <OutlinedInput 
            value={newLastName}
            onChange={(e)=>{
              // if (e.key === 'Space') e.preventDefault()
              setNewLastName(e.target.value.split(" ").join(""))
            }}
          />
          {newLastName !== user.lastName ? <Button variant='contained' name="lastName" onClick={(e)=>{handleSave(e.target.name, newLastName)}}>Save Last Name</Button> : ""}
        </Box>

        <Box className="email-section">
          <Typography variant='h6'>Email</Typography>
          <OutlinedInput 
            type='email'
            value={newEmail}
            onChange={(e)=>{
              // if (e.key === 'Space') e.preventDefault()
              setNewEmail(e.target.value.split(" ").join(""))
            }}
          />
          {newEmail !== user.email ? <Button variant='contained' name="email" onClick={(e)=>{handleSave(e.target.name, newEmail)}}>Save Email</Button> : ""}
        </Box> */}

      </Box>
    </Box>
    </>
  )
}
