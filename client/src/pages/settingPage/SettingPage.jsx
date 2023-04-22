import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSiteUser } from '../../states/index';

import axios from 'axios';
import {Formik} from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone"; //File/image upload

import { Box, useTheme, Typography, OutlinedInput, Dialog, TextField, Alert, InputAdornment, IconButton, Button} from '@mui/material'
import {Visibility, VisibilityOff, Lock} from "@mui/icons-material"

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
  const [newUserName, setNewUserName] = useState("")
  const [newFirstName, setNewFirstName] = useState("")
  const [newLastName, setNewLastName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newConfirmPassword, setNewConfirmPassword] = useState("")
  const [files, setFiles] = useState([]);

  
  const [error, setError] = useState(""); //JWT EXPIRED needs to be fixed

  const { palette  } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const userName = useSelector((state) => state.user.userName);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
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
    setError("")
    setBody({
      attribute:"",
      value:""
    })
  }

  console.log(user);

  async function handleSave(){
    if(newPassword !== newConfirmPassword){
      console.log("New passwords do not match")
      setError("New passwords do not match")
    }else{
      console.log("Password Match")
      console.log(body);
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
        window.location.reload();
      }).catch(err => {
        if (err.response){
          console.log(err.response.data);
          setError(err.response.data.message);
        }
        console.log(err);
      })
    }

    
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
              setNewUserName(e.target.value.split(" ").join(""))
            }}
          />
          {newUserName !== user.userName ? <Button variant='contained' name="userName" onClick={(e)=>handleOpenPopover(e.target.name, newUserName)}>Save Username</Button> : ""}
        </Box>


        <Box className="name-section">
          <Typography variant='h6'>First Name</Typography>
          <OutlinedInput 
            value={newFirstName}
            onChange={(e)=>{
              setNewFirstName(e.target.value.split(" ").join(""))
            }}
          />
          {newFirstName !== user.firstName ? <Button variant='contained' name="firstName" onClick={(e)=>{handleOpenPopover(e.target.name, newFirstName)}}>Save First Name</Button> : ""}

          <Typography variant='h6'>Last Name</Typography>
          <OutlinedInput 
            value={newLastName}
            onChange={(e)=>{
              setNewLastName(e.target.value.split(" ").join(""))
            }}
          />
          {newLastName !== user.lastName ? <Button variant='contained' name="lastName" onClick={(e)=>{handleOpenPopover(e.target.name, newLastName)}}>Save Last Name</Button> : ""}
        </Box>

        <Box className="email-section">
          <Typography variant='h6'>Email</Typography>
          <OutlinedInput 
            type='email'
            value={newEmail}
            onChange={(e)=>{
              setNewEmail(e.target.value.split(" ").join(""))
            }}
          />
          {newEmail !== user.email ? <Button variant='contained' name="email" onClick={(e)=>{handleOpenPopover(e.target.name, newEmail)}}>Save Email</Button> : ""}
        </Box>

        <Box className="new-password-section">
          <Typography variant='h6'>Change Password</Typography>
          <OutlinedInput
            type={showNewPassword ? "text": "password"}
            placeholder='New password'
            value={newPassword}
            onChange={(e)=>{
              setNewPassword(e.target.value.split(" ").join(""))
            }}
            endAdornment= {(
              <InputAdornment position="end">
                  <IconButton onClick={handleShowNewPassword}>
                  {!showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
              </InputAdornment>
              )}
          />

          <OutlinedInput
            type={showNewConfirmPassword ? "text": "password"}
            placeholder='Confirm new password'
            value={newConfirmPassword}
            onChange={(e)=>{
              setNewConfirmPassword(e.target.value.split(" ").join(""))
            }}
            endAdornment= {(
              <InputAdornment position="end">
                  <IconButton onClick={handleShowNewConfirmPassword}>
                  {!showNewConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
              </InputAdornment>
              )}
          /> 
          {newPassword && newConfirmPassword ? 
            <Button variant='contained' name="password" onClick={(e)=>{handleOpenPopover(e.target.name, newConfirmPassword)}}>Save Password</Button> : ""
          }
        </Box>

        <ConfirmPassword 
          open={open} 
          error={error}
          handleClose={handleClose} 
          setBody={setBody}
          handleSave={handleSave}
        />
      </Box>
    </Box>
    </>
  )
}
