import React from 'react'
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import {Box, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade } from '@mui/material';
import {SentimentNeutral, SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";
import QuickAction from './QuickAction';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
export default function Card2({item}) {
    console.log(item)

    return (
        <ImageListItem component={Link} to={item.siteUrl}>
            <img
                src={`${item.coverImage}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
                style={{borderRadius: "0.375rem", width: "160px", height: "220px"}}
            />
            <ImageListItemBar 
                title={item.title} 
                //position="below" 
                sx={{ 
                    width: "160px",
                    "& .MuiImageListItemBar-title": {fontSize: ".8rem", whiteSpace: "normal"}
                
                }}
            />
        </ImageListItem>
    )
}
