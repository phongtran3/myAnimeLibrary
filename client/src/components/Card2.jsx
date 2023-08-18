import React, { useState } from 'react';
import { useSelector } from "react-redux";
import {  
    ImageListItem, ImageListItemBar, IconButton, Link, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useTheme 
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';

const MANGA_FORMATS = ["MANGA", "ONE_SHOT", "NOVEL"];

export default function Card2({ item: { format, _id, coverImage, title, userStatus, siteUrl }, user, setUser }) {
    const { palette } = useTheme();
    const type = MANGA_FORMATS.includes(format) ? "manga" : "anime";
    const userStatuses = MANGA_FORMATS.includes(format) ? ["READING", "COMPLETED", "PLANNING"] : ["WATCHING", "COMPLETED", "PLANNING"];

    const [displayEditBtn, setDisplayEditBtn] = useState(false);
    const [open, setOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(userStatus)

    const loggedUser = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    function showBtn(e){
        e.preventDefault();
        setDisplayEditBtn(true);
    }
    function hideBtn(e){
        e.preventDefault();
        setDisplayEditBtn(false);
    }

    function handleOpen(){
        setOpen(true);
    }
    function handleClose(){
        setOpen(false);
        setCurrentStatus(userStatus);
        setDisplayEditBtn(false);
    }

    async function handleDelete(){
        const body = {
            "itemId": _id
        }
        await axios.patch(
            `https://myanimelibrary.onrender.com/${type}/${user._id}/remove`,
            {data: body},
            {headers: { Authorization: `${token}`}}
        ).then(res =>{
            setOpen(false);
            const updatedArr = res.data.map(el => el.id === _id ? {...el,userStatus: currentStatus } : el)
            if(type === 'anime'){
                setUser(prev => ({
                    ...prev,
                    animes: updatedArr
                }))
            }else{
                setUser(prev => ({
                    ...prev,
                    mangas: updatedArr
                }))
            }
        }).catch(err =>{
            if (err.response){
                console.log(err.response.data.message);
                //setError(err.response.data.message);
              }
        })
    }

    async function handleUpdate(){
        const body = {
            "userStatus": currentStatus,
            "itemId": _id
        }
        await axios.patch(
            `https://myanimelibrary.onrender.com/${type}/${user._id}/update`,
            {data: body},
            {headers: { Authorization: `${token}`}}
        ).then(res =>{
            setOpen(false);
            const updatedArr = res.data.map(el => el.id === _id ? {...el,userStatus: currentStatus } : el)
            if(type === 'anime'){
                setUser(prev => ({
                    ...prev,
                    animes: updatedArr
                }))
            }else{
                setUser(prev => ({
                    ...prev,
                    mangas: updatedArr
                }))
            }
        }).catch(err =>{
            if (err.response){
                //setError(err.response.data.message);
                console.log(err.response.data.message);
              }
        })
    }

    
    return (
        <ImageListItem 
            onMouseEnter={(e) => showBtn(e)}
            onMouseLeave={(e) => hideBtn(e)}
        >
            <img
                src={`${coverImage}?w=164&h=164&fit=crop&auto=format`}
                alt={title}
                loading="lazy"
            />
            <Link
                rel="noopener noreferrer" 
                target="_blank"
                underline="none"
                variant="body2"
                href={siteUrl}
            >
                <ImageListItemBar 
                    title={title} 
                    sx={{"& .MuiImageListItemBar-title": {fontSize: ".8rem", whiteSpace: "normal"}}}
                />
            </Link>

            {displayEditBtn && (loggedUser && loggedUser._id === user._id) && (
                <IconButton 
                    sx={{
                        position: "absolute",
                        height: "30px",
                        width: "30px",
                        backgroundColor: "#673ab7",
                        right: "10px",
                        top: "10px",
                        '&:hover': {
                            backgroundColor: "#9575cd"
                        }                    
                    }}
                    onClick={handleOpen}
                >
                    <MoreHorizIcon />
                </IconButton>
            )}

                    <Dialog open={open} onClose={handleClose} id="edit"
                        sx={{
                            ".MuiDialog-paper:first-of-type": {
                                //minWidth:"630px",
                                //maxWidth:"1000px",
                                //backgroundColor: "lightgray",
                                flexDirection: "row",
                                '@media (max-width: 630px)': {
                                    minWidth: "unset",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    overflowY: "visible",
                                    // ".MuiTypography-root":{
                                    //     padding: "0",
                                    // },
                                    ".MuiDialogContent-root:not(:first-of-type)":{
                                        gap: "1.5rem",
                                        padding: "0 1.5rem 1rem",
                                        ".MuiTypography-root":{
                                            padding: "0",
                                        },
                                    }

                                },
                            },
                        }}    
                    >
                        <DialogContent sx={{flex:"0 0 auto"}}>
                            <img 
                                src={`${coverImage}?w=164&h=164&fit=crop&auto=format`}
                                alt={title}
                            />
                        </DialogContent>
                        <DialogContent 
                            sx={{
                                display:"flex", 
                                flexDirection:"column",
                                "& .MuiInputBase-input":{
                                    cursor:"pointer",
                                },
                                "& .MuiOutlinedInput-notchedOutline":{
                                    borderWidth:"2px",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: palette.neutral.dark,
                                },
                                "& .MuiFormLabel-root, .MuiInputBase-root, .MuiInputLabel-root.Mui-focused": {
                                    color: palette.neutral.dark,
                                }
                            }}
                        >
                            <DialogTitle sx={{padding: "0 0 24px 0"}}>{title}</DialogTitle>
                            <Autocomplete
                                options={userStatuses}
                                getOptionLabel={(option) => option}
                                defaultValue=""
                                value={currentStatus ? currentStatus : null} 
                                inputValue={currentStatus ? currentStatus : ""}
                                onInputChange={(event, newInputValue) => {
                                    setCurrentStatus(newInputValue);
                                }}
                                disablePortal
                                id="user-status"
                                renderInput={(params) => 
                                    <TextField {...params} 
                                      label="Status" 
                                      inputProps={{
                                        ...params.inputProps,
                                        readOnly: true,
                                      }}
                                    />
                                }
                            />
                            <DialogActions 
                                sx={{
                                    alignItems:"flex-end", 
                                    marginTop:"auto", 
                                    padding:"0",
                                    ".MuiButtonBase-root":{
                                        color: palette.primary.dark,
                                        "&:hover":{
                                            backgroundColor:"rgba(103, 58, 183, 0.5);"
                                        }
                                    },
                                    
                                }}
                            >
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button onClick={handleDelete}>Delete</Button>
                                <Button onClick={handleUpdate}>Save</Button>
                            </DialogActions>
                        </DialogContent>
                    </Dialog>

        </ImageListItem>
    )
}
