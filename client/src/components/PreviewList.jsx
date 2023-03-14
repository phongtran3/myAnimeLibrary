import React from 'react'
import {ImageList, ImageListItem, Paper, Popper, Fade, Typography} from "@mui/material";
import PopupState, {bindPopover, bindHover, bindToggle, bindPopper} from "material-ui-popup-state";

export default function PreviewList({medium}) {
  return (
    <ImageList cols={6} gap={20} sx={{backgroundColor: "lightblue", textAlign: "center", padding:"15px", marginTop: ".5em"}}>
        {medium.map(media => (
            <PopupState  key={media._id} variant="popper" popupId="demoPopper" >
            {(popupState) => (
                <ImageListItem key={media._id} {...bindHover(popupState)}>
                    <a href={media.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                        <img
                            src={`${media.coverImage}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${media.coverImage}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt={media.title}
                            loading="lazy"
                            style={{borderRadius: "0.375rem"}}
                            width={"105px"}
                            height={"150px"}
                        />
                    </a>
                    <Popper {...bindPopper(popupState)} transition placement="right-start">
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} >
                            <Paper elevation={6} sx={{padding: ".5em"}}>
                                <Typography variant='subtitle2'>{media.title}</Typography>
                            </Paper>
                        </Fade>
                    )}
                    </Popper>
                </ImageListItem>
            )}
            </PopupState>
        ))}
    </ImageList>
  )
}
