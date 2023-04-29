import React, {useState} from 'react'
import {ImageListItem , ImageListItemBar, IconButton , Link} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { useSelector } from "react-redux";


export default function Card2({item, user}) {
    //console.log(item)
    const [displayEditBtn, setDisplayEditBtn] = useState(true);
    const [open, setOpen] = useState(false);

    const loggedUser = useSelector((state) => state.user);
    console.log(loggedUser);
    console.log(user)

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

    return (
        
        <ImageListItem 
            //onMouseEnter={(e) => showBtn(e)}
            //onMouseLeave={(e) => hideBtn(e)}
        >
            <img
                src={`${item.coverImage}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
                style={{borderRadius: "0.375rem"}}
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
            {displayEditBtn && loggedUser._id === user._id? 
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
                >
                    <MoreHorizIcon />
                </IconButton > : ""}
        </ImageListItem>
    )
}
