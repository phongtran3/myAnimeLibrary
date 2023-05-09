import React from 'react'
//import {Card, Typography, CardMedia, Button, ButtonBase} from "@mui/material"
import {Box, ImageList, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade } from '@mui/material';
import {SentimentNeutral, SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";
// import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import QuickAction from './QuickAction';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

export default function MediaList({media}) {
  const user = useSelector((state) => state.user);
  //console.log(media);
  return (
    // Large screen gap 72 / small screen 48
    <ImageList cols={5} gap={72} 
      sx={{
        textAlign: "center",
        padding: "2rem 0",
        '& > a':{
          transition: "transform 250ms"
        },
        '& > a:hover':{
            transform: "translateY(-15px)"
        }
      }}
      >
      {media.map(anime => (
        <PopupState key={anime.id} variant="popper" popupId="demoPopper" >
          {(popupState) => (
            <ImageListItem key={anime.id} {...bindHover(popupState)} component={Link} to={anime.siteUrl} target="_blank" rel="noopener noreferrer" >
                <img
                    src={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={anime.title.english === null ? anime.title.romaji : anime.title.english}
                    loading="lazy"
                    style={{borderRadius: "0.375rem", width: "230px", height: "360px"}}
                />
              <ImageListItemBar 
                title={anime.title.english === null ? anime.title.romaji : anime.title.english} 
                //position="below" 
                //subtitle={anime.title.english === null ? anime.title.romaji : anime.title.english}
                sx={{ maxWidth: "230px"}}
              />
              <Box sx={{"& .MuiButtonBase-root": {width:"40px", height:"40px"}}}>
                {user && <QuickAction 
                  title={anime.title.english === null ? anime.title.romaji : anime.title.english}
                  genres={anime.genres}
                  format={anime.format}
                  coverImage={anime.coverImage.large}
                  siteUrl={anime.siteUrl}
                  status={anime.status}
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
                              Genre: {anime.genres.map(genre => <a key={genre} href={`http://localhost:3000/search/anime?genres=${genre}`} style={{textDecoration: 'none'}}>{genre}</a>).reduce((prev,curr) => [prev, ', ', curr])}
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
