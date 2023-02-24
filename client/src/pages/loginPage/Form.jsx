import React, { useState} from "react";
import { TextField, Typography, useTheme, Button, Box, InputAdornment, IconButton } from "@mui/material";
import {Person, AccountCircle, Email, Lock,} from "@mui/icons-material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {Formik} from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone"; //File/image upload

const registerSchema = yup.object().shape({
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
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
    const [isLogin, setIsLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { palette  } = useTheme();

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);


    async function handleFormSubmit (values, onSubmitProps) {

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
                <form onSubmit={handleSubmit}>
                    <Box
                        display="flex"
                        flexDirection={"column"}
                        sx={{
                            "& .MuiInputBase-root": {background: `rgb(255,255,255, .94)`},
                            "& .MuiInputBase-root:hover": {background: `rgb(255,255,255, .94)`},
                            "& .MuiFilledInput-root.Mui-focused": {backgroundColor: `rgb(255,255,255, .94)`}
                        
                        }}
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
                                sx={{marginBottom: '10px'}}
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
                                sx={{marginBottom: '10px'}}

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
                                sx={{marginBottom: '10px'}}

                            />
                            <Box
                                border={`1px solid rgba(0, 0, 0, 0.23)`}
                                borderRadius="5px"
                                p=".75rem"
                                mb={'15px'}
                            >
                                <Dropzone
                                    acceptedFiles=".jpg,.jpeg,.png"
                                    multiple={false}
                                    onDrop={(acceptedFiles) =>
                                    setFieldValue("picture", acceptedFiles[0])
                                    }
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
                                    <EditOutlinedIcon />
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
                            sx={{marginBottom: '10px'}}

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
                                      {!showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                            }}
                            sx={{marginBottom: '10px'}}

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
                                        <IconButton onClick={handleShowConfirmPassword}>
                                          {!showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                }}
                                sx={{marginBottom: '10px'}}

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
                                p: "1rem",
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
                            {isLogin
                                ? "Don't have an account? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
        )}
        </Formik>
    )
  }
  