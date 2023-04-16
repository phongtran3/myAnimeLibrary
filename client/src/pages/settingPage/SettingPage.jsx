import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import {Formik} from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone"; //File/image upload

import { Box, TextField, Alert, } from '@mui/material'


const editProfileSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  newPassword: yup.string().required("required"),
  confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required("required"),
  userName: yup.string().required("required"),
  picture: yup.string().required("required"),
});

export default function SettingPage() {
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const userName = useSelector((state) => state.user.userName);

  async function getUser(){
    await axios.get(
      `http://localhost:5000/users/${userName}`,
      {headers: { Authorization: `${token}` }}
    ).then(res =>{
      //console.log(res);
      setUser(res.data);
    }).catch(err => {
      if (err.response){
        console.log(err.response.data);
      }
    console.log(err);
    }) 
  }

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return 
  }
  console.log(user);
  
  return (
    <>
    <NavBar />
    <Box maxWidth="1520px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>
      <Box 
        sx={{
          borderRadius: "4px",
          padding: "20px",
          background: "mediumpurple"
        
        }}
      >
        <h1>Setting Page</h1>



      </Box>
    </Box>
    </>
  )
}
