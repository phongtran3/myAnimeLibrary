import React, {useState} from 'react'
//import {Card, Typography, CardMedia, Button, ButtonBase} from "@mui/material"
import {Box, ImageList, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade, useMediaQuery } from '@mui/material';
import {SentimentNeutral, SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";
// import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import QuickAction from './QuickAction';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

export default function MediaList({media}) {
  const [alert, setAlert] = useState("");

  const user = useSelector((state) => state.user);
  const [displayQuickAction, setDisplayQuickAction] = useState(false);
  const tabletScreen = useMediaQuery("(min-width: 630px)");

  function showBtn(e){
    e.preventDefault();
    setDisplayQuickAction(true);
  }
  function hideBtn(e){
    e.preventDefault();
    setDisplayQuickAction(false);
  }

  return (
    // Large screen gap 72 / small screen 48
    <ImageList 
      sx={{
        overflowY: "visible !important",
        textAlign: "center",
        marginTop: "0.5rem",
        // '& > a':{
        //   transition: "transform 250ms"
        // },
        // '& > a:hover':{
        //       transform: "scale(1.05)"
        // },
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))!important',
        '@media (max-width: 545px)': {
          gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))!important',
        },
        gap:"25px !important" ,
        "a:nth-of-type(5)": {
          '@media only screen and (min-width: 1020px) and (max-width: 1265px)':{
            display: "none"
          }
        },
        "a:nth-of-type(6)": {
          '@media only screen and (min-width: 1020px) and (max-width: 1510px)':{
            display: "none"
          }
        },
      }}
      >
      {media.map(anime => (
        <PopupState key={anime.id} variant="popper" popupId="demoPopper" >
          {(popupState) => (
            <ImageListItem 
            onMouseEnter={(e) => showBtn(e)}
            onMouseLeave={(e) => hideBtn(e)}
              sx={{ 
                //width: "225px", 
                minHeight: "320px !important" 
              }}
              key={anime.id} 
              {...bindHover(popupState)} 
              component={Link} 
              to={anime.siteUrl} target="_blank" rel="noopener noreferrer" 
            >
                <img
                    src={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt={anime.title.english === null ? anime.title.romaji : anime.title.english}
                    loading="lazy"
                    style={{borderRadius: "0.375rem", width: "100%", height: "100%"}}
                />
              <ImageListItemBar 
                title={anime.title.english === null ? anime.title.romaji : anime.title.english} 
                //position="below" 
                //subtitle={anime.title.english === null ? anime.title.romaji : anime.title.english}
                //sx={{ maxWidth: "230px"}}
              />
              {user && displayQuickAction && 
                <Popper placement="bottom-end" {...bindPopper(popupState)} >
                  <QuickAction 
                    setAlert={setAlert}
                    title={anime.title.english === null ? anime.title.romaji : anime.title.english}
                    genres={anime.genres}
                    format={anime.format}
                    coverImage={anime.coverImage.large}
                    siteUrl={anime.siteUrl}
                    status={anime.status}
                  />
                </Popper>
              }
              
              {tabletScreen &&  
              <Popper {...bindPopper(popupState)} transition placement="right-start" sx={{width:'100%', maxWidth:'280px', minWidth:'250px'}}>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}  >
                      {/* May create seperate jsx component */}
                      <Paper elevation={6} 
                        sx={{
                          margin:"0 1rem",
                          padding: "10px"
                        }}
                      >
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
              }
          </ImageListItem>
         )}
      </PopupState>
      ))}
    </ImageList>
  )
}
