import React from 'react'
import {ImageList, ImageListItem, Link, ImageListItemBar} from "@mui/material";
import PopupState, {bindHover} from "material-ui-popup-state";

export default function PreviewList({medium}) {
  return (
    <ImageList 
        gap={20} 
        sx={{
            //backgroundColor: "lightblue", 
            textAlign: "center", 
            padding:"1rem 0", 
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr)) !important",
            "& .MuiImageListItem-root":{
                flexDirection:"row",
            }
        }}
    >
        {medium.map(media => (
            <PopupState  key={media._id} variant="popper" popupId="demoPopper" >
            {(popupState) => (
                <ImageListItem key={media._id} {...bindHover(popupState)}>
                    <a href={media.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                        <img
                            src={`${media.coverImage}?w=164&h=164&fit=crop&auto=format`}
                            alt={media.title}
                            loading="lazy"
                            style={{borderRadius: "0.375rem", width: "100%", height: "100%"}}
                        />
                    </a>
                    <Link
                        rel="noopener noreferrer" 
                        target="_blank"
                        underline="none"
                        variant="body2"
                        href={media.siteUrl}
                    >
                        <ImageListItemBar 
                            title={media.title} 
                            sx={{"& .MuiImageListItemBar-title": {fontSize: ".8rem", whiteSpace: "normal"}}}
                        />
                    </Link>
                </ImageListItem>
            )}
            </PopupState>
        ))}
    </ImageList>
  )
}
