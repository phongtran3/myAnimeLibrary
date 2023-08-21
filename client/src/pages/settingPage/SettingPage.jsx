import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import axios from 'axios';
import {
  Box, useTheme, Typography, TextField, InputAdornment, Switch,
  IconButton, Button, Avatar, Tab, Tabs, useMediaQuery
} from '@mui/material';

import {
  Visibility, VisibilityOff, EditOutlined, AccountCircle, Logout
} from "@mui/icons-material";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import ConfirmPassword from '../../components/ConfirmPassword';
import { setSiteUser, setLogout } from '../../states/index';

export default function SettingPage() {
    // Theme, Redux Selectors, and Utilities
    const { palette  } = useTheme();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedUser = useSelector((state) => state.user);
    const desktopScreen = useMediaQuery("(min-width: 1100px)");
  
    // State for User Attributes and Interaction
    const [body, setBody] = useState({
      attribute:"",
      value:"",
      currentPassword: "",
    });

    const [userDetails, setUserDetails] = useState({
      newUserName: '',
      newFirstName: '',
      newLastName: '',
      newEmail: '',
      newSocialMedia: {
        twitter: '',
        instagram: '',
        youtube: '',
        github: ''
      },
      newPicturePath:""
    });

    const {
      newUserName,
      newFirstName,
      newLastName,
      newEmail,
      newSocialMedia,
      newPicturePath
    } = userDetails;

    const [newPassword, setNewPassword] = useState("");
    const [newConfirmPassword, setNewConfirmPassword] = useState("");
    const [files, setFiles] = useState([]);
  
    // State for UI Elements and Toggles
    const [checked, setChecked] = useState(loggedUser.isAdult);
    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
    const [error, setError] = useState(""); 
  
    // Handlers
    const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleShowNewConfirmPassword = () => setShowNewConfirmPassword(!showNewConfirmPassword);
  
  useEffect(() => {
    setUserDetails(prevDetails => ({
      ...prevDetails,
      newUserName: loggedUser.userName || "",
      newFirstName: loggedUser.firstName || "",
      newLastName: loggedUser.lastName || "",
      newEmail: loggedUser.email || "",
      newSocialMedia: loggedUser.socialMediaHandles || {},
      newPicturePath: loggedUser.picturePath || "",
    }))
    setChecked(loggedUser.isAdult);
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [loggedUser]); 



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

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  };

  async function handleSave() {
    try {
      if (body.attribute === 'password' && newPassword !== newConfirmPassword) {
        setError("New passwords do not match");
        return;
      }
      const formData = createFormData(body, newPicturePath);
      const response = await axios.patch(
        `https://myanimelibrary.onrender.com/users/${loggedUser._id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`
          }
        }
      );
      setUserDetails(response.data);
      dispatch(setSiteUser({
        user: response.data,
        token: token,
      }));
      setOpen(false);
      resetBody();
  
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        setError(error.response.data.message);
      }
    }
  }
  
  // Separate utility function to create formData
  function createFormData(body, newPicturePath) {
    const formData = new FormData();
    for (let value in body) {
      formData.append(value, body[value]);
    }
    if (body.attribute === 'picturePath') formData.append('picture', newPicturePath);
    return formData;
  }
  
  function resetBody() {
    setBody({
      attribute: "",
      value: ""
    });
  }
  
  if (!userDetails) {
    return null;
  }
  
  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          maxWidth:"1520px",
          margin:"2rem auto",
          paddingBottom:"3rem",

        }}
      >

        <Box id="content" 
          sx={{
            display: desktopScreen ? "grid" : "block",
            gridTemplateColumns: "calc(40% - 30px) 60%",
            gap:"30px",
            height:"100%"
          }}
        >
          {/* will rename id later */}
          <Box id="profile-dashboard"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems:"center",
              margin:"0 1.5rem",
            }}
          > 
            <a href={`/user/${loggedUser.userName}`}><Avatar sx={{ width: 250, height: 250, marginBottom:"1rem"}} src={`${loggedUser.picturePath}`}/></a>
            <Tabs  
              id="tab-nav"
              orientation= {desktopScreen ? "vertical" : null}
              value={tabValue}
              variant="fullWidth"
              onChange={handleTabChange}
              sx={{
                margin:"1rem 0",
                width: desktopScreen ? "250px" : null,
                border: `1px solid ${palette.primary.dark}`,
                "& .MuiButtonBase-root":{
                  flexDirection:"row",
                  justifyContent:"flex-start",
                  "&:hover":{
                    background: palette.primary.light,
                  },
                  "& .MuiSvgIcon-root":{
                    marginRight:"1rem",
                  }
                },
                "& .MuiButtonBase-root.Mui-selected":{
                  color: palette.primary.dark
                },
                ".MuiTabs-indicator":{
                  backgroundColor: palette.primary.dark,
                  width: "4px",
                }
              }}
            >
              <Tab icon={<AccountCircle />} label="Account Setting" />
              <Tab icon={<Logout />} label="Logout" 
                onClick={()=>{
                  dispatch(setLogout());
                }}
              />
            </Tabs>
          </Box>


          <Box id="account-settings" 
            sx={{ 
              borderRadius: "4px", 
              margin:"0 1.5rem",
              "& h4,h5":{
                color: palette.neutral.dark,
              },
              "& .MuiButtonBase-root":{
                textTransform: "none",
              },
              //Each Section
              "& > div":{
                display:"flex",
                alignItems:"strech",
                flexDirection:"column", 
                "& .MuiInputBase-root":{
                  height:"50px",
                  borderRadius:"8px",
                },
                "hr":{
                  marginBottom:"1.5rem", 
                  border:"none", 
                  height:"1px", 
                  backgroundColor: palette.neutral.main
                },
                //Each textfield within the sections
                "& > div":{
                  marginBottom:"1rem",
                  display:"flex",
                  alignItems:"center",
                  flexGrow:"1",
                  "& .MuiFormControl-root":{
                    flexGrow:"1",
                    marginRight:"1.5rem",
                    ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: palette.primary.dark
                    },
                    ".MuiInputLabel-root.Mui-focused":{
                      color: palette.primary.dark
                    },
                  },
                },
              },
              '@media (max-width: 440px)': {
                  "& > div":{
                    //Sections
                    "& > div":{
                      flexDirection:"column",
                      alignItems: "flex-start",
                      ".MuiFormControl-root":{
                        width: "100%"
                      },
                    },
                  },
                  ".MuiBox-root  > .MuiButtonBase-root":{
                    margin: ".5rem 0"
                  },
              },
            }} 
          >
            {/* ACCOUNT SETTING */}
            {tabValue === 0 && 
            <>
              <Typography variant='h4' 
                sx={{  
                  color: "#111111", 
                  margin:"0 0 2rem 0!important;",
                  fontWeight:"600",
                }}
              >
                Account Settings
              </Typography>

              <Box id="basic-info-section">
                <Typography variant="h5" 
                  sx={{  
                    color: "#111111", 
                    fontWeight:"600",
                    }}
                >
                  Basic Info
                </Typography>
                <hr style={{}}></hr>

                <Box className="firstName-section">
                  <TextField 
                      placeholder='First Name'
                      label="First Name"
                      variant="outlined"
                      value={newFirstName}
                      onChange={(e)=>{
                        setUserDetails(prev => ({
                          ...prev,
                          newFirstName: e.target.value.split(" ").join("")
                        }))
                      }}
                    />
                  {newFirstName !== loggedUser.firstName ? <Button variant='contained' name="firstName" onClick={(e)=>{handleOpenPopover(e.target.name, newFirstName)}}>Save First Name</Button> : ""}
                </Box>

                <Box className="lastName-section">
                  <TextField 
                    placeholder='Last Name'
                    label="Last Name"
                    variant="outlined"
                    value={newLastName}
                    onChange={(e)=>{
                      setUserDetails(prev => ({
                        ...prev,
                        newLastName: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                  {newLastName !== loggedUser.lastName ? <Button variant='contained' name="lastName" onClick={(e)=>{handleOpenPopover(e.target.name, newLastName)}}>Save Last Name</Button> : ""}
                </Box>

                <Box className="userName-section">
                  <TextField 
                    placeholder='Username'
                    label="Username"
                    variant="outlined"
                    value={newUserName}
                    onChange={(e)=>{
                      setUserDetails(prev => ({
                        ...prev,
                        newUserName: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                  {newUserName !== loggedUser.userName ? <Button variant='contained' name="userName" onClick={(e)=>handleOpenPopover(e.target.name, newUserName)}>Save Username</Button> : ""}
                </Box>

                <Box className="email-section">
                  <TextField 
                    placeholder='Email@email.com'
                    label="Email"
                    variant="outlined"
                    value={newEmail}
                    onChange={(e)=>{
                      setUserDetails(prev => ({
                        ...prev,
                        newEmail: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                    {newEmail !== loggedUser.email ? <Button variant='contained' name="email" onClick={(e)=>{handleOpenPopover(e.target.name, newEmail)}}>Save Email</Button> : ""}
                </Box>

                <Box className="profile-image-section">
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => {
                      setUserDetails(prev => ({
                        ...prev,
                        newPicturePath: acceptedFiles[0] //File object
                      }))
                      handleOpenPopover("picturePath", acceptedFiles[0].name)
                    }}
                  >
                    {({getRootProps, getInputProps }) => (
                      <Box
                          {...getRootProps()}
                          sx={{ 
                            padding:".75rem",
                            "&:hover": { 
                              cursor: "pointer" 
                            },
                            border:`2px dashed ${palette.primary.dark}`,
                            flexGrow: "1",
                            marginRight:"1.5rem",
                          }}
                      >
                        <input {...getInputProps()} />
                        {!newPicturePath.name? (
                          <p>Drop Image here or click to upload</p>
                        ) : (
                        <Box display="flex" justifyContent={"space-between"} alignItems={'center'}>
                          <Typography>{newPicturePath.name ? newPicturePath.name : loggedUser.picturePath }</Typography>
                          <Box display={"flex"} alignItems={"center"}>
                            <EditOutlined />
                          </Box>
                        </Box>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>

                <Box
                  sx={{
                    flexDirection:"row !important",
                    alignItems:"center !important",
                  }}
                >
                  <Switch 
                    checked={checked}
                    labelplacement="end"
                    name="isAdult"
                    label="18+ Content"
                    onChange={(e)=> handleOpenPopover(e.target.name, e.target.checked)}
                  />
                  <Typography fontWeight={600} color={"#9575cd"}>18+ Content</Typography>
                </Box>
              </Box>
              
              <Box id="external-links"
                sx={{
                  "& .MuiButtonBase-root":{
                    marginBottom:"25px",
                  }
                }}
              >
                <Typography variant="h5" 
                  sx={{  
                    color: "#111111", 
                    fontWeight:"600",
                    }}
                >
                  External Links
                </Typography>
                <hr></hr>
                <Box id="twitter">
                    <TextField 
                      placeholder='https://twitter.com/Crunchyroll'
                      label="Twitter"
                      value={newSocialMedia.twitter}
                      variant="outlined"
                      helperText="URL (required)"
                      onChange={(e)=>{
                        setUserDetails(prev => ({
                          ...prev,
                          newSocialMedia: {
                            ...prev.newSocialMedia,
                            twitter: e.target.value.split(" ").join("")
                          }
                        }))
                      }}
                    />
                    {newSocialMedia.twitter !== loggedUser.socialMediaHandles.twitter ?
                      <Button 
                        variant='contained'
                        name="socialMediaHandles"
                        onClick={(e)=>{handleOpenPopover(e.target.name, newSocialMedia.twitter)}}
                      >
                        Save Twitter
                      </Button> : ""
                    }
                  </Box>

                  <Box id="instagram">
                    <TextField 
                      placeholder='https://www.instagram.com/nextshark/'
                      label="Instagram"
                      value={newSocialMedia.instagram}
                      variant="outlined"
                      helperText="URL (required)"
                      onChange={(e)=>{
                        setUserDetails(prev => ({
                          ...prev,
                          newSocialMedia: {
                            ...prev.newSocialMedia,
                            instagram: e.target.value.split(" ").join("")
                          }
                        }))
                      }}
                    />
                    {newSocialMedia.instagram !== loggedUser.socialMediaHandles.instagram ?
                      <Button 
                        variant='contained'
                        name="socialMediaHandles"
                        onClick={(e)=>{handleOpenPopover(e.target.name, newSocialMedia.instagram)}}
                      >
                        Save Instagram
                      </Button> : ""
                    }
                  </Box>
                  
                  <Box id="youtube">
                    <TextField 
                      placeholder='https://www.youtube.com/@dreamylofi'
                      label="Youtube"
                      value={newSocialMedia.youtube}
                      variant="outlined"
                      helperText="URL (required)"
                      onChange={(e)=>{
                        setUserDetails(prev => ({
                          ...prev,
                          newSocialMedia: {
                            ...prev.newSocialMedia,
                            youtube: e.target.value.split(" ").join("")
                          }
                        }))
                      }}
                    />
                    {newSocialMedia.youtube !== loggedUser.socialMediaHandles.youtube ?
                      <Button 
                        variant='contained'
                        name="socialMediaHandles"
                        onClick={(e)=>{handleOpenPopover(e.target.name, newSocialMedia.youtube)}}
                      >
                        Save Youtube
                      </Button> : ""
                    }
                  </Box>

                  <Box id="github">
                    <TextField 
                      placeholder='https://github.com/phongtran3'
                      label="Github"
                      value={newSocialMedia.github}
                      variant="outlined"
                      helperText="URL (required)"
                      onChange={(e)=>{
                        setUserDetails(prev => ({
                          ...prev,
                          newSocialMedia: {
                            ...prev.newSocialMedia,
                            github: e.target.value.split(" ").join("")
                          }
                        }))
                      }}
                    />
                    {newSocialMedia.github !== loggedUser.socialMediaHandles.github ?
                      <Button 
                        variant='contained'
                        name="socialMediaHandles"
                        onClick={(e)=>{handleOpenPopover(e.target.name, newSocialMedia.github)}}
                      >
                        Save Github
                      </Button> : ""
                    }
                  </Box>

              </Box>
              
              <Box id="change-password"> 
                <Typography variant="h5" 
                    sx={{  
                      color: "#111111", 
                      fontWeight:"600",
                      }}
                  >
                    Change Password
                  </Typography>
                  <hr></hr>

                  <Box className="new-password-section">
                    <TextField 
                      placeholder='New password'
                      type={showNewPassword ? "text": "password"}
                      label="Password"
                      value={newPassword}
                      variant="outlined"
                      onChange={(e)=>{setNewPassword(e.target.value.split(" ").join(""))}}
                      InputProps={{
                        endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowNewPassword}>
                            {!showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                      }}
                    />
                  </Box>

                  <Box>
                    <TextField 
                      placeholder='Confirm new password'
                      type={showNewConfirmPassword ? "text": "password"}
                      label="Confirm New Password"
                      value={newConfirmPassword}
                      variant="outlined"
                      onChange={(e)=>{setNewConfirmPassword(e.target.value.split(" ").join(""))}}
                      InputProps={{
                        endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowNewConfirmPassword}>
                            {!showNewConfirmPassword  ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                      }}
                    />
                  </Box>
                  {newPassword && newConfirmPassword ? 
                    <Button
                      sx={{marginRight:"1.5rem"}} 
                      variant='contained' 
                      name="password" 
                      onClick={(e)=>{handleOpenPopover(e.target.name, newConfirmPassword)}}
                    >Save Password</Button> : ""
                  }    
              </Box>

            </>
            
            }
            <ConfirmPassword 
              open={open} 
              error={error}
              handleClose={handleClose} 
              setBody={setBody}
              handleSave={handleSave}
              palette={palette}
            />

          </Box>
        </Box>
      </Box>
    <Footer/>
    </Box>
  )
}
