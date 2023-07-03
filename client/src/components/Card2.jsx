import React, {useState} from 'react'
import { useSelector } from "react-redux";

import {ImageListItem , ImageListItemBar, IconButton , Link, Autocomplete} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Alert  } from '@mui/material'
import axios from 'axios';

const mangaFormat = ["MANGA", "ONE_SHOT", "NOVEL"];

export default function Card2({item, user}) {
    //console.log(item)
    const type = mangaFormat.indexOf(item.format) > -1 ? "manga" : "anime";
    const userStatuses = [
        mangaFormat.indexOf(item.format) > -1 ? "READING" : "WATCHING",
        "COMPLETED",
        "PLANNING"
    ]
    const [displayEditBtn, setDisplayEditBtn] = useState(false);
    const [open, setOpen] = useState(false);
    const [userStatus, setUserStatus] = useState(item.userStatus)

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
    }

    async function handleDelete(){
        console.log("Deleting");
        const body = {
            "itemId": item._id
        }
        await axios.patch(
            `http://localhost:5000/${type}/${user._id}/remove`,
            {data: body},
            {headers: { Authorization: `${token}`}}
        ).then(res =>{
            console.log(res);

            setOpen(false);
            window.location.reload();
        }).catch(err =>{
            if (err.response){
                console.log(err.response.data);
                //setError(err.response.data.message);
              }
              console.log(err);
        })
    }

    async function handleUpdate(){
        console.log("Saving");
        const body = {
            "userStatus": userStatus,
            "itemId": item._id
        }
        await axios.patch(
            `http://localhost:5000/${type}/${user._id}/update`,
            {data: body},
            {headers: { Authorization: `${token}`}}
        ).then(res =>{
            console.log(res);
            setOpen(false);
            window.location.reload();

        }).catch(err =>{
            if (err.response){
                console.log(err.response.data);
                //setError(err.response.data.message);
              }
              console.log(err);
        })

    }
    return (
        <ImageListItem 
            onMouseEnter={(e) => showBtn(e)}
            onMouseLeave={(e) => hideBtn(e)}
        >
            <img
                src={`${item.coverImage}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
            />
            <Link
                rel="noopener noreferrer" 
                target="_blank"
                underline="none"
                variant="body2"
                href={item.siteUrl}
            >
                <ImageListItemBar 
                    title={item.title} 
                    sx={{"& .MuiImageListItemBar-title": {fontSize: ".8rem", whiteSpace: "normal"}}}
                />
            </Link>
            {displayEditBtn && (loggedUser && loggedUser._id === user._id) ? 
                <IconButton 
                    sx={{
                        position: "absolute",
                        height: "30px",
                        width: "30px",
                        backgroundColor: "purple",
                        right: "10px",
                        top: "10px",
                        '&:hover':{
                            backgroundColor: "lightpink"
                        }                    
                    }}
                    onClick={handleOpen}
                >
                    <MoreHorizIcon />
                </IconButton > : ""}

                <Dialog open={open} onClose={handleClose} id="edit"
                    sx={{
                        ".MuiDialog-paper:first-of-type": {
                            minWidth:"700px",
                            //maxWidth:"1000px",
                            backgroundColor: "lightgray",
                            flexDirection: "row"
                        },
                    }}    
                >
                    <DialogContent sx={{flex:"0 0 auto"}}>
                        <img 
                            src={`${item.coverImage}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                        />
                    </DialogContent>
                    <DialogContent sx={{display:"flex", flexDirection:"column"}}>
                        <DialogTitle sx={{padding: "0 0 24px 0"}}>{item.title}</DialogTitle>
                        <Autocomplete
                            options={userStatuses}
                            getOptionLabel={(option) => option}
                            defaultValue=""
                            value={userStatus ? userStatus : null} 
                            inputValue={userStatus ? userStatus : ""}
                            onInputChange={(event, newInputValue) => {
                                setUserStatus(newInputValue);
                            }}
                            disablePortal
                            id="user-status"
                            //sx={{ width: 500 }}
                            renderInput={(params) => <TextField {...params} label="Status" />}
                            />
                            <DialogActions sx={{alignItems:"flex-end", marginTop:"auto", padding:"0"}}>
                                <Button onClick={handleDelete}>Delete</Button>
                                <Button onClick={handleUpdate}>Save</Button>
                            </DialogActions>
                    </DialogContent>
                    
                </Dialog>
        </ImageListItem>
    )
}
