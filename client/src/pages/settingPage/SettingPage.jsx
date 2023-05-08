import React, {useState, useEffect} from 'react'
import NavBar from '../../components/NavBar'
import { useSelector, useDispatch } from "react-redux";
import { setSiteUser } from '../../states/index';
import Dropzone from "react-dropzone"; //File/image upload
import { Box, useTheme, Typography, OutlinedInput, TextField, InputAdornment, IconButton, Button} from '@mui/material'
import {Visibility, VisibilityOff, EditOutlined,} from "@mui/icons-material"
import ConfirmPassword from '../../components/ConfirmPassword';
import ProfileCard from '../../components/ProfileCard';
import axios from 'axios';

// import {Formik} from "formik";
// import * as yup from "yup";
// import { useNavigate } from "react-router-dom";




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
  const [newPicturePath, setNewPicturePath] = useState("")
  const [newSocialMedia, setNewSocialMedia] = useState({})
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
      setNewSocialMedia(res.data.socialMediaHandles)
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
  //console.log(user.socialMediaHandles);
  console.log(newSocialMedia);

  async function handleSave(){
    if(body.attribute === 'password' && newPassword !== newConfirmPassword){
      //console.log("New passwords do not match")
      setError("New passwords do not match")
    }else{
      console.log("Password Match")
      console.log(body);
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
      <Box id="content" 
        display="grid"
        gridTemplateColumns= "calc(40% - 30px) 60%"
        gap="30px"
      >
        <Box id="section-1"> 
          {/* will rename id later */}
          <ProfileCard 
            user={user}
            setUser={setUser}
          />
        </Box>
        <Box id="section-2" sx={{ borderRadius: "4px", padding: "20px", background: "mediumpurple" }} >
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
              <Button 
                variant='contained' 
                name="password" 
                onClick={(e)=>{handleOpenPopover(e.target.name, newConfirmPassword)}}
              >Save Password</Button> : ""
            }
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
                console.log(body);
                console.log(acceptedFiles)
              }}
            >
              {({getRootProps, getInputProps }) => (
                <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ "&:hover": { cursor: "pointer" } }}
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


          {/* {newEmail !== user.email ? <Button variant='contained' name="email" onClick={(e)=>{handleOpenPopover(e.target.name, newEmail)}}>Save Email</Button> : ""} */}
          
          <Box className="social-media-section">
            <Typography variant='h6'>Social Media</Typography>
            <Box display="flex" alignItems="center">
                <Typography variant='subtitle1'>Twitter </Typography>
                  <TextField 
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

            <Box display="flex" alignItems="center">
              <Typography variant='subtitle1'>Instagram</Typography>
                <TextField 
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

            <Box display="flex" alignItems="center">
              <Typography variant='subtitle1'>Youtube</Typography>
                <TextField 
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

            <Box display="flex" alignItems="center">
              <Typography variant='subtitle1'>Github</Typography>
                <TextField 
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
