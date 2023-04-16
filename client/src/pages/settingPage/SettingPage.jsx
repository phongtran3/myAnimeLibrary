import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import {Formik} from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone"; //File/image upload

import { Box, useTheme, Typography, TextField, Alert, InputAdornment, IconButton } from '@mui/material'
import {Person, AccountCircle, Email, Lock, Visibility, VisibilityOff, EditOutlined} from "@mui/icons-material"


export default function SettingPage() {
  const [user, setUser] = useState(null);
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

  const editProfileSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    newPassword: yup.string().required("required"),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match').required("required"),
    userName: yup.string().required("required"),
    picture: yup.string().required("required"),
  });
  
  const editProfileInitialValues= {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName,
    picture: user.picturePath,
    newPassword: "",
    confirmNewPassword: "",
  
  };
  console.log(user);
  

  async function handleFormSubmit (values, onSubmitProps) {
      // if(isLogin) await login(values, onSubmitProps);
      // if(!isLogin) await register(values, onSubmitProps);
  }
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
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={editProfileInitialValues}
            validationSchema={editProfileSchema}
        >
          {({
            values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              resetForm,
              }) => (
                <>
                <Typography variant='h4' sx={{  color: "white", display: "flex",  justifyContent:"center", marginBottom:"10px"  }}>Edit Profile</Typography>
                {error ? <Alert severity="error" sx={{marginBottom:"10px"}}> {error}</Alert> : null }

                <form onSubmit={handleSubmit}>
                  <Box>
                    <TextField
                      autoComplete="off"
                      variant="filled"
                      label="First Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      name="firstName"
                      error={ Boolean(touched.firstName) && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                    
                    <TextField
                      autoComplete="off"
                      variant="filled"
                      label="Last Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.lastName}
                      name="lastName"
                      error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />

                    <TextField
                      autoComplete="off"
                      variant="filled"
                      label="Username"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userName}
                      name="userName"
                      error={Boolean(touched.userName) && Boolean(errors.userName)}
                      helperText={touched.userName && errors.userName}
                    />    

                    <TextField
                      autoComplete="off"
                      variant="filled"
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={Boolean(touched.email) && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />  

                    <TextField
                      autoComplete="off"
                      variant="filled"
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.newPassword}
                      name="newPassword"
                      error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                      helperText={touched.newPassword && errors.newPassword}
                      InputProps={{
                          endAdornment: (
                          <InputAdornment position="end">
                              <IconButton onClick={handleShowNewPassword}>
                              {!showNewPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                          </InputAdornment>
                          ),
                      }}
                    /> 

                    <TextField
                      autoComplete="off"
                      variant="filled"
                      label="Confirm New Password"
                      type={showNewConfirmPassword ? 'text' : 'password'}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmNewPassword}
                      name="confirmNewPassword"
                      error={Boolean(touched.confirmNewPassword) && Boolean(errors.confirmNewPassword)}
                      helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                      InputProps={{
                          endAdornment: (
                          <InputAdornment position="end">
                              <IconButton onClick={handleShowNewConfirmPassword}>
                              {!showNewConfirmPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                          </InputAdornment>
                          ),
                      }}
                    /> 

                    <Box >
                      <Dropzone
                          acceptedFiles=".jpg,.jpeg,.png"
                          multiple={false}
                          onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
                      >
                      {({ getRootProps, getInputProps }) => (
                      <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                      <input {...getInputProps()} />
                      {!values.picture ? (
                      <p>Add Picture Here</p>
                      ) : (
                      <Box
                          display="flex"
                          justifyContent={"space-between"}
                          alignItems={'center'}
                      >
                          <Typography>{values.picture.name ? values.picture.name : values.picture }</Typography>
                          <EditOutlined />
                      </Box>
                      )}
                      </Box>
                      )}
                      </Dropzone>
                  </Box>

                  </Box>
                </form>





                </>
              )}

        </Formik>
      </Box>
    </Box>
    </>
  )
}
