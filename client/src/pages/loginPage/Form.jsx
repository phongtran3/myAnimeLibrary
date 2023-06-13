import React, { useState} from "react";
import { TextField, Typography, useTheme, Button, Box, InputAdornment, IconButton, Alert  } from "@mui/material";
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
    confirmPassword: '',

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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { palette  } = useTheme();
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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

    return (
        <Formik
            onSubmit={handleFormSubmit}
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
                            background:"#EDE7F6",
                            marginLeft:"calc(2rem*-1)",
                            padding: "2rem",
                            borderRadius: "10px",
                        }}
                    >
                    <Typography 
                        variant="h3" 
                        sx={{
                            color: "#111111", 
                            display: "flex", 
                            justifyContent:"flex-start", 
                            marginBottom:"10px",
                            fontWeight: "600"
                        }}
                    > 
                        {!isLogin ? "Create Account" : "Login"}
                    </Typography>
                    {error ? <Alert severity="error" sx={{marginBottom:"10px"}}> {error}</Alert> : null }
                    {/* <Alert severity="error">{error ? error : ""}</Alert> */}
                    <form onSubmit={handleSubmit}>
                        <Box
                            // display="flex"
                            // flexDirection={"column"}
                            sx={{
                                "& .MuiInputBase-root": {background: `rgb(255,255,255, .94)`},
                                "& .MuiInputBase-root:hover": {background: `rgb(255,255,255, .94)`},
                                "& .MuiFilledInput-root.Mui-focused": {backgroundColor: `rgb(255,255,255, .94)`},
                                "& .MuiSvgIcon-root" :{color: 'black'},
                                "& > div": { gridColumn: undefined }
                            
                            }}
                            display="grid"
                            columnGap="10px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            //background: rgb(255,255,255, .94)
                        >
                            {!isLogin && (
                                <>
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
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{marginBottom: '5px', gridColumn: "span 2" }}
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
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{marginBottom: '5px', gridColumn: "span 2" }}

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
                                    InputProps={{
                                        startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                        ),
                                    }}
                                    sx={{marginBottom: '5px', gridColumn: "span 4" }}

                                />
                                <Box
                                    sx={{ gridColumn: "span 4" }}
                                    border={`1px solid rgba(0, 0, 0, 0.23)`}
                                    borderRadius="5px"
                                    p=".75rem"
                                    mb={'15px'}

                                >
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
                                        <Typography>{values.picture.name}</Typography>
                                        <EditOutlined />
                                    </Box>
                                    )}
                                    </Box>
                                    )}
                                    </Dropzone>
                                </Box>
                                </>
                            )}

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
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                    ),
                                }}
                                sx={{marginBottom: '5px', gridColumn: "span 4" }}
                            />

                            <TextField
                                autoComplete="off"
                                variant="filled"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
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
                                sx={{marginBottom: '5px', gridColumn: "span 4" }}
                            />

                            {!isLogin && (
                                <TextField
                                    autoComplete="off"
                                    variant="filled"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.confirmPassword}
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
                                    sx={{marginBottom: '5px', gridColumn: "span 4" }}
                                />
                            )}

                        </Box>

                        {/* BUTTONS */}
                        <Box>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    m: "0",
                                    p: ".5rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { color: palette.primary.dark, backgroundColor: palette.primary.light, },
                                }}
                                >
                                {isLogin ? "LOGIN" : "REGISTER"}
                            </Button>
                            <Typography
                                onClick={() => {
                                    setIsLogin(isLogin ? false : true )
                                    setError(null);
                                    resetForm();
                                }}
                                sx={{
                                    textDecoration: "underline",
                                    color: palette.primary.main,
                                    "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light,
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
    )
  }
  