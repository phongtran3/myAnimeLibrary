import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import PopupState, { bindHover, bindPopper } from "material-ui-popup-state";
import { 
    Box, 
    ImageListItem, 
    ImageListItemBar, 
    Typography, 
    Paper, 
    Popper, 
    Fade, 
    useMediaQuery, 
    useTheme 
} from '@mui/material';

import QuickAction from './QuickAction';


export default function Card({item, setAlert, type}) {
  const {
      id,
      siteUrl,
      coverImage,
      title,
      genres,
      format,
      status,
      averageScore,
      episodes,
      duration
    } = item;
    const titleText = title.english || title.romaji;
    const [displayQuickAction, setDisplayQuickAction] = useState(false);
    const tabletScreen = useMediaQuery("(min-width: 630px)");
    const user = useSelector((state) => state.user);
    const { palette } = useTheme();

    function showBtn(e){
        e.preventDefault();
        setDisplayQuickAction(true);
    }
    function hideBtn(e){
        e.preventDefault();
        setDisplayQuickAction(false);
    }

    const RenderGenres = () => {
      return genres.length > 0 ? 
        genres.map(genre => (
          <Typography 
              component={Link} 
              key={genre} 
              to={`/search/${type}?genres=${genre}`} 
              sx={{textDecoration: 'none', color: palette.primary.dark}}
          >
              {genre}
          </Typography>
        )).reduce((prev, curr) => [prev, ', ', curr]) 
        : null;
      };

    return (  
        <PopupState 
            key={id} 
            variant="popper" 
            popupId="dataPopper"
        >
            {(popupState) => (
                <ImageListItem 
                    onMouseEnter={(e) => showBtn(e)}
                    onMouseLeave={(e) => hideBtn(e)}
                    key={id}
                    {...bindHover(popupState)} 
                    component={Link} 
                    to={siteUrl}
                    target="_blank" rel="noopener noreferrer" 
                >
                    <img
                        src={coverImage.extraLarge}
                        srcSet={coverImage.extraLarge}
                        alt={titleText}
                        loading="lazy"
                        style={{borderRadius: "0.375rem", width: "100%", height: "100%"}}
                    />
                <ImageListItemBar 
                    title={titleText} 
                />
                {user && displayQuickAction &&
                    <Popper 
                      placement="bottom-end" 
                      //disablePortal
                      modifiers={[
                        {
                          name: 'flip',
                          enabled: false
                        },
                      ]}
                      {...bindPopper(popupState)} 
                    >
                      <QuickAction 
                          setAlert={setAlert}
                          title={titleText}
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
                    //disablePortal
                    placement="right-start" 
                    sx={{
                    maxWidth:'300px', 
                    }}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}  >
                      {/* May create seperate jsx component */}
                      <Paper elevation={6} 
                        sx={{
                            background: palette.background.alt,
                            margin:"0 .5rem !important",
                            padding: "15px",
                            "& div":{
                              ".MuiTypography-root":{
                                display: "inline-block"
                              },
                              "span":{
                                fontSize: "0.875rem",
                              }
                            },
                            "& > div:not(:first-of-type)":{
                              "& > .MuiTypography-root ":{
                                color: palette.mode === "dark" ? palette.neutral.medium : "#212121",
                              },
                              "span":{
                                color: palette.neutral.dark,
                                fontWeight:"600",
                              }
                            },
                            "div:last-child":{
                              "& a":{
                                "&:hover":{
                                  color:`${palette.mode === "dark" ? "#d1c4e9" : "#b39ddb"} !important`,
                                }
                              }
                            }
                        }}
                      >
                        <Box id="title" >
                          <Typography sx={{color: palette.primary.dark, fontWeight: "600"}}>{titleText}</Typography>
                        </Box>

                        {averageScore &&
                        <Box id="score">
                           <Typography variant='body2'> Average Score: </Typography> <span>{averageScore}%</span>
                        </Box>
                        }

                        <Box id="format">
                          <Typography variant='body2' >Format: </Typography> <span>{format === 'TV' ? "TV Show" : format}</span>
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
                          <Typography variant="body2">
                              Genre: <span><RenderGenres /></span>
                          </Typography>
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
