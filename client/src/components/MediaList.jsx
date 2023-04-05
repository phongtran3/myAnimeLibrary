import React from 'react'
//import {Card, Typography, CardMedia, Button, ButtonBase} from "@mui/material"
import {Box, ImageList, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade } from '@mui/material';
import {SentimentNeutral, SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, {bindPopover, bindHover, bindToggle, bindPopper} from "material-ui-popup-state";
import QuickAction from './QuickAction';
import { useSelector } from "react-redux";

export default function MediaList({media}) {
  const user = useSelector((state) => state.user);
  //console.log(media);
  return (
    <ImageList cols={5} gap={48} sx={{textAlign: "center"}}>
      {media.map(anime => (
        <PopupState key={anime.id} variant="popper" popupId="demoPopper" >
          {(popupState) => (
            <ImageListItem key={anime.id} {...bindHover(popupState)}>
              <a href={anime.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
                <img
                    src={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={anime.title.english === null ? anime.title.romaji : anime.title.english}
                    loading="lazy"
                    style={{borderRadius: "0.375rem", width: "230px", height: "360px"}}
                />
              <ImageListItemBar 
                title={anime.title.english === null ? anime.title.romaji : anime.title.english} 
                position="below" 
                sx={{
                  '& .MuiImageListItemBar-title': {whiteSpace: "normal"},
                  maxWidth: "230px"
                }}
              />
              </a>
              <Box sx={{"& .MuiButtonBase-root": {width:"40px", height:"40px"}}}>
                {user && <QuickAction 
                  title={anime.title.english === null ? anime.title.romaji : anime.title.english}
                  genres={anime.genres}
                  format={anime.format}
                  coverImage={anime.coverImage.large}
                  siteUrl={anime.siteUrl}
              />}
              </Box>
                <Popper {...bindPopper(popupState)} transition placement="right-start" sx={{width:'100%', maxWidth:'280px', minWidth:'250px'}}>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}  >
                      {/* May create seperate jsx component */}
                      <Paper elevation={6} 
                        sx={{
                          margin:"0 5px",
                          padding: "10px"
                        }}>
                          <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <Typography variant='subtitle2' width='190px'>{anime.title.english === null ? anime.title.romaji : anime.title.english}</Typography>
                            {anime.averageScore > 75 ? <SentimentSatisfiedAlt/> : anime.averageScore > 60 ? <SentimentNeutral /> : anime.averageScore !== null ? <SentimentVeryDissatisfied/> : null}
                            <Typography variant='subtitle2' fontWeight="600">{anime.averageScore && `${anime.averageScore}%`}</Typography>
                          </Box>
                          <Box>
                            <Typography variant='body2' mt="5px">{anime.format === 'TV' ? "TV Show" : anime.format} {anime.episodes ? `\u2022 ${anime.episodes} Episodes` : null} {anime.duration ? `\u2022 ${anime.duration} Minutes` : null}</Typography>
                          </Box>
                          <Typography variant='body2' mt="5px">Status: {anime.status[0] + anime.status.slice(1).toLowerCase()}</Typography>
                          <Box>
                            {anime.genres.length > 0 ? 
                              (<Typography variant="body2" mt="5px">
                              Genre: {anime.genres.map(genre => <a key={genre} href={anime.siteUrl} style={{textDecoration: 'none'}}>{genre}</a>).reduce((prev,curr) => [prev, ', ', curr])}
                              </Typography>) : null
                            }
                          </Box>
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
