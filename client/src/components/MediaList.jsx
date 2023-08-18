import React, { useState } from 'react';
import { 
  Box, ImageList, ImageListItem, ImageListItemBar, 
  Typography, Paper, Popper, Fade, useMediaQuery 
} from '@mui/material';
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import QuickAction from './QuickAction';

export default function MediaList({media, setAlert}) {
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
    <ImageList 
      sx={{
        overflowY: "visible !important",
        textAlign: "center",
        marginTop: "0.5rem",
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
      {media.map(item => {
      const { id, coverImage, title, format, genres, siteUrl, status, averageScore, episodes, duration } = item;
      const displayTitle = displayTitle;
      return (
        <PopupState key={id} variant="popper" popupId="demoPopper" >
          {(popupState) => (
            <ImageListItem 
            onMouseEnter={(e) => showBtn(e)}
            onMouseLeave={(e) => hideBtn(e)}
              sx={{ 
                minHeight: "320px !important" 
              }}
              key={id} 
              {...bindHover(popupState)} 
              component={Link} 
              to={siteUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
            >
                <img
                    src={`${coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                    alt={displayTitle}
                    loading="lazy"
                    style={{borderRadius: "0.375rem", width: "100%", height: "100%"}}
                />
              <ImageListItemBar title={displayTitle} />
        
              {user && displayQuickAction && 
                <Popper placement="bottom-end" {...bindPopper(popupState)} >
                  <QuickAction 
                    setAlert={setAlert}
                    title={displayTitle}
                    genres={genres}
                    format={format}
                    coverImage={coverImage.large}
                    siteUrl={siteUrl}
                    status={status}
                  />
                </Popper>
              }
              
              {tabletScreen &&  
              <Popper 
                {...bindPopper(popupState)} 
                transition 
                placement="right-start" 
                sx={{
                  maxWidth:'320px', 
                }}
              >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}  >
                      {/* May create seperate jsx component */}
                      <Paper elevation={6} 
                        sx={{
                          margin:"0 1rem !important",
                          padding: "15px",
                          "& div > .MuiTypography-root ":{
                            display: "inline-block"
                          },
                          "& div > span":{
                            fontSize: "0.875rem",
                          }
                        }}
                      >
                        <Box id="title" >
                          <Typography sx={{color: "#673ab7", fontWeight: "600"}}>{displayTitle}</Typography>
                        </Box>

                        {averageScore &&
                        <Box id="score">
                           <Typography variant='body2'> Average Score: </Typography> <span>{averageScore}%</span>
                        </Box>
                        }

                        <Box id="format">
                          <Typography variant='body2' sx={{display:"inline-block"}}>Format: </Typography> <span>{format === 'TV' ? "TV Show" : format}</span>
                        </Box>
                        
                        {episodes && 
                          <Box id="episodes">
                            <Typography variant='body2'>Episodes: </Typography> <span>{episodes} Episodes</span>
                          </Box>
                        }

                        {duration &&
                        <Box id="duration">
                          <Typography variant='body2'>Duration: </Typography> <span>{duration} Minutes</span>
                        </Box>
                        }

                        <Box id="status">
                          <Typography variant='body2'>Status: </Typography> <span>{status[0] + status.slice(1).toLowerCase()}</span>
                        </Box>

                        <Box id="genre">
                          {genres.length > 0 ? 
                            (<Typography variant="body2">
                            Genre: <span>
                              {genres.map(genre => <a key={genre} href={`https://myanimelibrary.onrender.com/search/anime?genres=${genre}`} 
                              style={{textDecoration: 'none', color: "#673ab7"}}>{genre}</a>).reduce((prev,curr) => [prev, ', ', curr])}
                            </span>
                            </Typography>
                            
                            ) : null
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
      )})}
    </ImageList>
  )
}
