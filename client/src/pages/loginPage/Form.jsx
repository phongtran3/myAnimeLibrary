import React, { useState } from "react";
import { TextField, Typography, useTheme, Button, Box, InputAdornment, IconButton } from "@mui/material";
import {EditOutlinedIcon, Person, Lock, Visibility, VisibilityOff    } from "@mui/icons-material"
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
  };
  
  const loginInitalValues = {
    email: "",
    password: "",
  };

  
  export default function Form() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pallete } = useTheme();

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

            </form>
        )}

        </Formik>
    )
  }
  