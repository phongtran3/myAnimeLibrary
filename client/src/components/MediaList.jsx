import React from 'react'
//import {Card, Typography, CardMedia, Button, ButtonBase} from "@mui/material"
import { ImageList, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade } from '@mui/material';
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, {bindPopover, bindHover, bindToggle, bindPopper} from "material-ui-popup-state";


export default function Media({media}) {
  //console.log(media);

  return (
    <ImageList cols={5} gap={48} sx={{textAlign: "center"}}>
      {media.map(anime => (
        <PopupState key={anime.id} variant="popper" popupId="demoPopper">
          {(popupState) => (
            <ImageListItem key={anime.id} {...bindHover(popupState)}>
            <a href={anime.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
              <img
                  src={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={anime.title.english === null ? anime.title.romaji : anime.title.english}
                  loading="lazy"
                  style={{borderRadius: "0.375rem", width: "230px", height: "326px"}}
              />
            <ImageListItemBar title={anime.title.english === null ? anime.title.romaji : anime.title.english}  position="below" sx={{maxWidth: "230px"}}/>
            </a>
            <Popper {...bindPopper(popupState)} transition placement="right-start">
              {({ TransitionProps }) => (
                <Fade {...TransitionProps}  >
                  <Paper>
                    <Typography >
                      The content of the Popper.
                    </Typography>
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
