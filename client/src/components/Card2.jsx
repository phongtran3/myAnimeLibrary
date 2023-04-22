import React from 'react'
import {ImageListItem , ImageListItemBar} from '@mui/material';
import { Link } from 'react-router-dom';

export default function Card2({item}) {
    //console.log(item)
    return (
        <ImageListItem component={Link} to={item.siteUrl}>
            <img
                src={`${item.coverImage}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${item.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt={item.title}
                loading="lazy"
                style={{borderRadius: "0.375rem"}}
            />
            <ImageListItemBar 
                title={item.title} 
                //position="below" 
                sx={{ 
                    
                    "& .MuiImageListItemBar-title": {fontSize: ".8rem", whiteSpace: "normal"}
                
                }}
            />
        </ImageListItem>
    )
}