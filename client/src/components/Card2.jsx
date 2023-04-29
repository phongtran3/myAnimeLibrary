import React, {useState} from 'react'
import {ImageListItem , ImageListItemBar} from '@mui/material';
//import { Link } from 'react-router-dom';
import { Link } from '@mui/material';
export default function Card2({item}) {
    //console.log(item)
    const [displayEditBtn, setDisplayEditBtn] = useState(false);
    //component={Link} to={item.siteUrl}
    return (
        <ImageListItem >
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
        </ImageListItem>
    )
}
