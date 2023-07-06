import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector, useDispatch } from "react-redux";
import { setSiteUser, setLogout } from '../../states/index';
import Dropzone from "react-dropzone"; //File/image upload
import { Box, useTheme, Typography, TextField, InputAdornment, Switch, 
  IconButton, Button, Avatar, Tab, Tabs, useMediaQuery } from '@mui/material'
import {Visibility, VisibilityOff, EditOutlined, AccountCircle, Logout} from "@mui/icons-material"
import ConfirmPassword from '../../components/ConfirmPassword';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function SettingPage() {
  const { palette  } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedUser = useSelector((state) => state.user);
  console.log(loggedUser);
  //const userName = useSelector((state) => state.user.userName);
  const desktopScreen = useMediaQuery("(min-width: 1100px)");

  //const [checked, setChecked] = useState(loggedUser.isAdult)
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
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
  const [newPicturePath, setNewPicturePath] = useState("")
  const [newSocialMedia, setNewSocialMedia] = useState({})
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(""); //JWT EXPIRED needs to be fixed
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleShowNewConfirmPassword = () => setShowNewConfirmPassword(!showNewConfirmPassword);

  

  


  // async function getUser(){
  //   await axios.get(
  //     `http://localhost:5000/users/${userName}`,
  //     {headers: { Authorization: `${token}` }}
  //   ).then(res =>{
  //     console.log(res.data);
  //     setUser(res.data);
  //     setNewUserName(res.data.userName);
  //     setNewFirstName(res.data.firstName);
  //     setNewLastName(res.data.lastName);
  //     setNewEmail(res.data.email);
  //     setNewSocialMedia(res.data.socialMediaHandles)
  //   }).catch(err => {
  //     if (err.response){
  //       console.log(err.response.data);
  //     }
  //     console.log(err);
  //   }) 
  // }

  useEffect(() => {
    //getUser();
    setUser(loggedUser);
    setNewUserName(loggedUser.userName);
    setNewFirstName(loggedUser.firstName);
    setNewLastName(loggedUser.lastName);
    setNewEmail(loggedUser.email);
    setNewSocialMedia(loggedUser.socialMediaHandles)
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

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  };

  //console.log(user);
  //console.log(user.socialMediaHandles);
  //console.log(newSocialMedia);

  async function handleSave(){
    if(body.attribute === 'password' && newPassword !== newConfirmPassword){
      //console.log("New passwords do not match")
      setError("New passwords do not match")
    }else{
      //console.log("Password Match")
      //console.log(body);
      const formData = new FormData();
      for (let value in body) {
        formData.append(value, body[value]);
      }
      if(body.attribute === 'picturePath') formData.append('picture', newPicturePath);
      
      await axios.patch(
        `http://localhost:5000/users/${user._id}/update`, 
        formData, 
        {headers: { "Content-Type": "multipart/form-data", Authorization: `${token}`}}
      ).then(res =>{
        console.log(res.data);
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
        <Box id="section-1"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems:"center",
            margin:"0 1.5rem",
          }}
        > 
          <a href={`/user/${user.userName}`}><Avatar sx={{ width: 250, height: 250, marginBottom:"1rem"}} src={`http://localhost:5000/assets/${user.picturePath}`}/></a>
          <Tabs  
            id="tab-nav"
            orientation= {desktopScreen ? "vertical" : null}
            value={tabValue}
            variant="fullWidth"
            onChange={handleTabChange}
            sx={{
              margin:"1rem 0",
              width: desktopScreen ? "250px" : null,
              border:"1px solid black",
              "& .MuiButtonBase-root ":{
                flexDirection:"row",
                justifyContent:"flex-start",
                "&:hover":{
                  background: "#b39ddb",
                  color: "#673ab7",
                },
                "& .MuiSvgIcon-root":{
                  marginRight:"1rem",
                }

              }
            }}
          >
            <Tab icon={<AccountCircle />} label="Account Setting" />
            <Tab icon={<Logout />} label="Logout" 
              onClick={()=>{
                dispatch(setLogout());
                navigate("/");
              }}
            />
          </Tabs>
        </Box>


        <Box id="section-2" 
          sx={{ 
            borderRadius: "4px", 
            margin:"0 1.5rem",
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
              //Each textfield within the sections
              "& > div":{
                marginBottom:"1.5rem",
                display:"flex",
                alignItems:"center",
                flexGrow:"1",
                "& .MuiFormControl-root":{
                  flexGrow:"1",
                  marginRight:"1.5rem",
                },
              },
            }
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
                  //margin:"0 0 2rem 0!important;",
                  fontWeight:"600",
                  }}
              >
                Basic Info
              </Typography>
              <hr style={{marginBottom:"1.5rem", border:"none", height:"1px", backgroundColor:"#111111"}}></hr>

              <Box className="firstName-section">
                <TextField 
                    placeholder='First Name'
                    label="First Name"
                    variant="outlined"
                    value={newFirstName}
                    onChange={(e)=>{setNewFirstName(e.target.value.split(" ").join(""))}}
                  />
                {newFirstName !== user.firstName ? <Button variant='contained' name="firstName" onClick={(e)=>{handleOpenPopover(e.target.name, newFirstName)}}>Save First Name</Button> : ""}
              </Box>

              <Box className="lastName-section">
                <TextField 
                  placeholder='Last Name'
                  label="Last Name"
                  variant="outlined"
                  value={newLastName}
                  onChange={(e)=>{setNewLastName(e.target.value.split(" ").join(""))}}
                />
                {newLastName !== user.lastName ? <Button variant='contained' name="lastName" onClick={(e)=>{handleOpenPopover(e.target.name, newLastName)}}>Save Last Name</Button> : ""}
              </Box>

              <Box className="userName-section">
                <TextField 
                  placeholder='Username'
                  label="Username"
                  variant="outlined"
                  value={newUserName}
                  onChange={(e)=>{setNewUserName(e.target.value.split(" ").join(""))}}
                />
                {newUserName !== user.userName ? <Button variant='contained' name="userName" onClick={(e)=>handleOpenPopover(e.target.name, newUserName)}>Save Username</Button> : ""}
              </Box>

              <Box className="email-section">
                <TextField 
                  placeholder='Email@email.com'
                  label="Email"
                  variant="outlined"
                  value={newEmail}
                  onChange={(e)=>{setNewEmail(e.target.value.split(" ").join(""))}}
                />
                  {newEmail !== user.email ? <Button variant='contained' name="email" onClick={(e)=>{handleOpenPopover(e.target.name, newEmail)}}>Save Email</Button> : ""}
              </Box>

              <Box className="profile-image-section">
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    setNewPicturePath(acceptedFiles[0]) //File object
                    //handleOpenPopover("picturePath", acceptedFiles[0].name)
                    handleOpenPopover("picturePath", acceptedFiles[0].name)
                    //setBody({attribute: "picturePath", value: acceptedFiles[0].name})
                    //console.log(body);
                    //console.log(acceptedFiles)
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
                          border:`2px dashed ${palette.primary.main}`,
                          flexGrow: "1",
                          marginRight:"1.5rem",
                        }}
                    >
                      <input {...getInputProps()} />
                      {!newPicturePath.name? (
                        <p>Drop Image here or click to upload</p>
                      ) : (
                      <Box display="flex" justifyContent={"space-between"} alignItems={'center'}>
                        <Typography>{newPicturePath.name ? newPicturePath.name : user.picturePath }</Typography>
                        <Box display={"flex"} alignItems={"center"}>
                          <EditOutlined />
                        </Box>
                      </Box>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>

              <Box>
                <Switch 
                  defaultChecked={loggedUser.isAdult}
                  //checked={checked}
                  labelplacement="end"
                  name="isAdult"
                  label="18+ Content"
                  onChange={(e)=> handleOpenPopover(e.target.name, e.target.checked)}
                />
                <Typography fontWeight={600} color={"#673ab7"}>18+ Content</Typography>
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
                  //margin:"0 0 2rem 0!important;",
                  fontWeight:"600",
                  }}
              >
                External Links
              </Typography>
              <hr style={{marginBottom:"1.5rem", border:"none", height:"1px", backgroundColor:"#111111"}}></hr>
              <Box id="twitter">
                  <TextField 
                    placeholder='https://twitter.com/Crunchyroll'
                    label="Twitter"
                    value={newSocialMedia.twitter}
                    variant="outlined"
                    helperText="URL (required)"
                    onChange={(e)=>{
                      setNewSocialMedia(prev =>({
                        ...prev,
                        twitter: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                  {newSocialMedia.twitter !== user.socialMediaHandles.twitter ?
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
                      setNewSocialMedia(prev =>({
                        ...prev,
                        instagram: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                  {newSocialMedia.instagram !== user.socialMediaHandles.instagram ?
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
                      setNewSocialMedia(prev =>({
                        ...prev,
                        youtube: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                  {newSocialMedia.youtube !== user.socialMediaHandles.youtube ?
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
                      setNewSocialMedia(prev =>({
                        ...prev,
                        github: e.target.value.split(" ").join("")
                      }))
                    }}
                  />
                  {newSocialMedia.github !== user.socialMediaHandles.github ?
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
                    //margin:"0 0 2rem 0!important;",
                    fontWeight:"600",
                    }}
                >
                  Change Password
                </Typography>
                <hr style={{marginBottom:"1.5rem", border:"none", height:"1px", backgroundColor:"#111111"}}></hr>

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
          />

        </Box>
      </Box>
    </Box>
    </>
  )
}
