import React, { useState} from "react";
import { TextField, Typography, Button, Box, InputAdornment, IconButton, Alert, useMediaQuery  } from "@mui/material";
import {Person, AccountCircle, Email, Lock, Visibility, VisibilityOff, EditOutlined} from "@mui/icons-material"
import {Formik} from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone"; //File/image upload
import { setLogin } from "../../states";
import axios from "axios";

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required("required"),
    userName: yup.string().required("required"),
    picture: yup.string().required("required"),
  });

  const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

  const registerInitalValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
    picture: "",
    confirmPassword: "",

  };
  
  const loginInitalValues = {
    email: "",
    password: "",
  };

  
  export default function Form() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [pictureError, setPictureError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const tabletScreen = useMediaQuery("(min-width: 630px)");
    const desktopScreen = useMediaQuery("(min-width: 1040px)");

    async function login (values, onSubmitProps) {
        await axios.post(
            "http://localhost:5000/auth/login",
            JSON.stringify(values), 
            {headers: { 
                "Content-Type": "application/json",
            }}
        )   
        .then(res => {
            console.log("logging in");
            console.log(res);
            onSubmitProps.resetForm();
            dispatch(
                setLogin({
                    user: res.data.user,
                    token: res.data.token,
                })
            );
            navigate("/");
        })
        .catch(err => {
            if (err.response){
                console.log(err.response.data);
                setError(err.response.data.message);
            }
            console.log(err);
        })
        // const loggedInResponse = await fetch("http://localhost:5000/auth/login", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(values),
        // });
        // const loggedIn = await loggedInResponse.json();
        // onSubmitProps.resetForm();
        // console.log(loggedIn)
        // console.log(loggedIn.status)
        // if (loggedIn) {
        //     dispatch(
        //         setLogin({
        //         user: loggedIn.user,
        //         token: loggedIn.token,
        //         })
        //     );
        //     console.log(loggedIn)
        //     navigate("/");  
        // }
    }

    async function register (values, onSubmitProps) {
        const formData = new FormData(); //Allows sending data with image
        for (let value in values) {
            formData.append(value, values[value]);
        }
        formData.append('picturePath', values.picture.name);
        console.log(formData);
        console.log(values);
        await axios.post("http://localhost:5000/auth/register", formData)
            .then(res => {
                console.log("registering");
                console.log(res);
                onSubmitProps.resetForm();
                setIsLogin("false");

            }).catch(err => {
                if (err.response){
                    console.log(err.response.data);
                    setError(err.response.data.message);
                }
                console.log(err);
            })

        // const savedUserResponse = await fetch( "http://localhost:5000/auth/register", {
        //         method: "POST",
        //         body: formData,
        //     }
        // );
        // const savedUser = await savedUserResponse.json();
        // console.log(savedUser)
        // onSubmitProps.resetForm();
        // if (savedUser) {
        //     setIsLogin("false");
        // }
    }




    async function handleFormSubmit (values, onSubmitProps) {
        if(isLogin) await login(values, onSubmitProps);
        if(!isLogin) await register(values, onSubmitProps);
    }
    //console.log(isLogin);

    return (
        <>
        <Box id="img" 
            sx={{
                width:"100%", 
                height:"inherit",
                display: desktopScreen ? "block": "none",
            }}
        >
          <img 
            alt="card"
            style={{
              width:"100%", 
              height:"100%", 
              objectFit:"cover",
              borderRadius: "10px"
            }} 
            src={isLogin ? 
                'https://w0.peakpx.com/wallpaper/245/1014/HD-wallpaper-sung-jin-woo-magenta-manhwa-tbate-anime-aesthetic-the-beginning-after-the-end-manga-purple-shadow-monarch.jpg':
                'https://w0.peakpx.com/wallpaper/52/58/HD-wallpaper-shinobu-kocho-anime-girl-butterfly-demon-slayer-shinobu-kocho.jpg'}
          />
        </Box>
        <Formik
            onSubmit={handleFormSubmit}
            enableReinitialize
            initialValues={isLogin ? loginInitalValues :registerInitalValues }
            validationSchema={isLogin ? loginSchema : registerSchema}
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
                <Box id='form-container'
                    sx={{
                        background: tabletScreen ? "#EDE7F6" : null,
                        marginLeft: !desktopScreen ? null : "calc(2rem*-1)",
                        padding: "2rem",
                        borderRadius: "10px",
                    }}
                >
                    <Box 
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: desktopScreen ? "flex-start" : "center",
                            marginTop: isLogin ? "5rem" : null
                        }}
                    
                    
                    >
                        <Typography variant="h3" 
                            sx={{
                                color: "#111111", 
                                display: "flex", 
                                justifyContent:"flex-start", 
                                fontWeight: "600"
                            }}
                        > 
                            {!isLogin ? "Create Account" : "Login"}
                        </Typography>
                    {isLogin && <Typography color="#111111" mt={".5rem"}>Welcome back!</Typography>}

                    </Box>
                    
                    {error ? <Alert severity="error" sx={{marginBottom:"10px"}}> {error}</Alert> : null }
                    {/* <Alert severity="error">{error ? error : ""}</Alert> */}
                    <form onSubmit={handleSubmit}>
                        <Box
                            id='form-field-wrapper'
                            sx={{
                                marginTop:"2rem",
                                "& .MuiFormControl-root ":{
                                    marginBottom:"1rem",
                                },
                                "& .MuiFormLabel-root, .MuiInputBase-input":{
                                    color:"#111111",
                                },
                                "& .MuiOutlinedInput-notchedOutline":{
                                    borderColor: "#111111",
                                },
                                "& .MuiInputBase-root.MuiOutlinedInput-root:not(.Mui-error):not(.Mui-focused):hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#bdbdbd",
                                    borderWidth:"2px",
                                },
                                "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline":{
                                    borderWidth:"2px",
                                },
                                "& .MuiInputBase-root": {
                                    background: "none", 
                                    height:"45px"
                                },
                                "& .MuiFormHelperText-root":{
                                    marginTop: "0px",
                                },
                                // "& .MuiInputBase-root:hover": {
                                //     background: "none",                             
                                // },
                                //"& .MuiFilledInput-root.Mui-focused": {backgroundColor: `rgb(255,255,255, .94)`},
                                "& .MuiSvgIcon-root" :{
                                    color: 'black'
                                },
                                "& > div": {
                                    gridColumn: undefined 
                                }
                            }}
                            display="grid"
                            columnGap="10px"
                            rowGap="5px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            //background: rgb(255,255,255, .94)
                        >
                            {!isLogin && (
                                <>
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    label="First Name"
                                    placeholder="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName || ""}
                                    name="firstName"
                                    error={ Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{gridColumn: tabletScreen ? "span 2": "span 4"}}
                                />
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    label="Last Name"
                                    placeholder="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName || ""}
                                    name="lastName"
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    helperText={touched.lastName && errors.lastName}
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{gridColumn: tabletScreen ? "span 2": "span 4"}}

                                />
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    label="Username"
                                    placeholder="Username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.userName || ""}
                                    name="userName"
                                    error={Boolean(touched.userName) && Boolean(errors.userName)}
                                    helperText={touched.userName && errors.userName}
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{gridColumn: "span 4" }}

                                />
                                <Box
                                    sx={{
                                        borderRadius:"5px",
                                        padding:".75rem",
                                        marginBottom: pictureError && !values.picture ? null: "1rem",
                                        gridColumn: "span 4", 
                                        border:`1px solid ${pictureError && !values.picture ? "#d32f2f" : "#111111"}`,
                                        "&:hover":{
                                            borderColor: pictureError ? null : "#bdbdbd",
                                        }
                                    }}
                                    id="dropzone-wrapper"
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onChange={() => {console.log("Change")}}
                                        onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
                                    >
                                    {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed #673ab7`}
                                        p=".5rem"
                                        sx={{ "&:hover": { cursor: "pointer" } }}
                                    >
                                    <input {...getInputProps()}  />
                                    {!values.picture ? (
                                    <p style={{color: pictureError ? "#d32f2f" : "#111111"}}>Add Picture Here</p>
                                    ) : (
                                    <Box
                                        display="flex"
                                        justifyContent={"space-between"}
                                        alignItems={'center'}
                                    >
                                        <Typography sx={{color:"#111111", overflow:"hidden", }}>{values.picture.name}</Typography>
                                        <EditOutlined />
                                    </Box>
                                    )}
                                    </Box>
                                    )}
                                    </Dropzone>
                                </Box>

                                {pictureError && !values.picture ? 
                                    <p 
                                        style={{
                                            color:"#d32f2f",
                                            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                                            fontSize: "0.75rem",
                                            lineHeight: 1.66,
                                            letterSpacing: "0.03333em",
                                            textAlign: "left",
                                            margin:"0px 14px 10px",
                                        }}
                                    >
                                        required
                                    </p>: null
                                }
                                </>
                                
                            )}

                            <TextField
                                autoComplete="off"
                                variant="outlined"
                                label="Email"
                                placeholder="email@email.com"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email || "" }
                                name="email"
                                error={Boolean(touched.email) && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                    ),
                                }}
                                sx={{gridColumn: "span 4" }}
                            />

                            <TextField
                                autoComplete="off"
                                variant="outlined"
                                label="Password"
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password || "" }
                                name="password"
                                error={Boolean(touched.password) && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleShowPassword}>
                                        {!showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                                sx={{gridColumn: "span 4" }}
                            />

                            {!isLogin && (
                                <TextField
                                    autoComplete="off"
                                    variant="outlined"
                                    label="Confirm Password"
                                    placeholder="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword || "" }
                                    name="confirmPassword"
                                    error={Boolean(touched.confirmPassword) && Boolean(errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                            <Lock />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowConfirmPassword}>
                                            {!showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{gridColumn: "span 4" }}
                                />
                            )}

                        </Box>

                        {/* BUTTONS */}
                        <Box mt=".5rem">
                            <Button
                                onClick={()=>{
                                    if(!values.picture) setPictureError("testing");
                                    else setPictureError(null);
                                }}
                                fullWidth
                                type="submit"
                                sx={{
                                    fontWeight:"600",
                                    p: ".5rem",
                                    backgroundColor: '#673ab7',
                                    color: "#111111",
                                    "&:hover": { 
                                        //color: palette.primary.dark, 
                                        backgroundColor: '#9575cd',
                                    },
                                }}
                                >
                                {isLogin ? "LOGIN" : "CREATE ACCOUNT"}
                            </Button>
                            <Typography
                                onClick={() => {
                                    setIsLogin(isLogin ? false : true );
                                    resetForm();
                                    setError(null);
                                    setPictureError(null);
                                }}
                                sx={{
                                    width:"fit-content",
                                    marginTop: "10px",
                                    textDecoration: "none",
                                    color: "#111111",
                                    "&:hover": {
                                    cursor: "pointer",
                                    color: '#673ab7'
                                    },
                                }}
                                >
                                {isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login here."}
                            </Typography>
                        </Box>
                    </form>
                </Box>
            )}
        </Formik>
        </>
    )
  }
  