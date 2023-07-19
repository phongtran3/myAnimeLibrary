import React, {useState} from 'react'
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import {Box, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade, useMediaQuery } from '@mui/material';
import QuickAction from './QuickAction';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

export default function Card({item, setAlert}) {
    const [displayQuickAction, setDisplayQuickAction] = useState(false);
    const tabletScreen = useMediaQuery("(min-width: 630px)");
    //console.log(item.isAdult);

    function showBtn(e){
        e.preventDefault();
        setDisplayQuickAction(true);
    }
    function hideBtn(e){
        e.preventDefault();
        setDisplayQuickAction(false);
    }

    const user = useSelector((state) => state.user);
    const params = useParams();
    const type = params.media;

    return (
        <PopupState 
            key={item.id} 
            variant="popper" 
            popupId="demoPopper"
        >
            {(popupState) => (
                <ImageListItem 
                    onMouseEnter={(e) => showBtn(e)}
                    onMouseLeave={(e) => hideBtn(e)}
                    key={item.id}
                    {...bindHover(popupState)} 
                    component={Link} 
                    to={item.siteUrl}
                    target="_blank" rel="noopener noreferrer" 
                >
                    <img
                        src={`${item.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${item.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title.english === null ? item.title.romaji : item.title.english}
                        loading="lazy"
                        style={{borderRadius: "0.375rem", width: "100%", height: "100%"}}
                    />
                <ImageListItemBar 
                    title={item.title.english === null ? item.title.romaji : item.title.english} 
                />
                {user && displayQuickAction &&
                    <Popper placement="bottom-end" {...bindPopper(popupState)} >
                            <QuickAction 
                                setAlert={setAlert}
                                title={item.title.english === null ? item.title.romaji : item.title.english}
                                genres={item.genres}
                                format={item.format}
                                coverImage={item.coverImage.large}
                                siteUrl={item.siteUrl}
                                status={item.status}
                            />
                    </Popper>
                
                }
                {tabletScreen && 
                <Popper 
                    {...bindPopper(popupState)} 
                    transition 
                    placement="right-start" 
                    sx={{
                    //margin:"0 1rem !important",
                    maxWidth:'300px', 
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
                          <Typography sx={{color: "#673ab7", fontWeight: "600"}}>{item.title.english === null ? item.title.romaji : item.title.english}</Typography>
                        </Box>

                        {item.averageScore &&
                        <Box id="score">
                           <Typography variant='body2'> Average Score: </Typography> <span>{item.averageScore}%</span>
                        </Box>
                        }

                        <Box id="format">
                          <Typography variant='body2' sx={{display:"inline-block"}}>Format: </Typography> <span>{item.format === 'TV' ? "TV Show" : item.format}</span>
                        </Box>
                        
                        {item.episodes && 
                          <Box id="episodes">
                            <Typography variant='body2'>Episodes: </Typography> <span>{item.episodes} Episodes</span>
                          </Box>
                        }

                        {item.duration &&
                        <Box id="duration">
                          <Typography variant='body2'>Duration: </Typography> <span>{item.duration} Minutes</span>
                        </Box>
                        }

                        <Box id="status">
                          <Typography variant='body2'>Status: </Typography> <span>{item.status[0] + item.status.slice(1).toLowerCase()}</span>
                        </Box>

                        <Box id="genre">
                          {item.genres.length > 0 ? 
                            (<Typography variant="body2">
                            Genre: <span>
                              {item.genres.map(genre => <a key={genre} href={`http://localhost:3000/search/item?genres=${genre}`} 
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
    )
}
