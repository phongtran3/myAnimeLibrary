import React from 'react'
import PopupState, {bindHover, bindPopper} from "material-ui-popup-state";
import {Box, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade } from '@mui/material';
import {SentimentNeutral, SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";
import QuickAction from './QuickAction';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

export default function Card({item}) {
    const user = useSelector((state) => state.user);
    const params = useParams();
    const type = params.media;

    return (
        <PopupState key={item.id} variant="popper" popupId="demoPopper" >
            {(popupState) => (
                <ImageListItem key={item.id} {...bindHover(popupState)} component={Link} to={item.siteUrl}>
                    <img
                        src={`${item.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
                        srcSet={`${item.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title.english === null ? item.title.romaji : item.title.english}
                        loading="lazy"
                        style={{borderRadius: "0.375rem", width: "230px", height: "360px"}}
                    />
                <ImageListItemBar 
                    title={item.title.english === null ? item.title.romaji : item.title.english} 
                    //position="below" 
                    sx={{ maxWidth: "230px"}}
                />
                <Box sx={{"& .MuiButtonBase-root": {width:"40px", height:"40px"}}}>
                    {user && <QuickAction 
                    title={item.title.english === null ? item.title.romaji : item.title.english}
                    genres={item.genres}
                    format={item.format}
                    coverImage={item.coverImage.large}
                    siteUrl={item.siteUrl}
                    status={item.status}
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
                                <Typography variant='subtitle2' width='190px'>{item.title.english === null ? item.title.romaji : item.title.english}</Typography>
                                {item.averageScore > 75 ? <SentimentSatisfiedAlt/> : item.averageScore > 60 ? <SentimentNeutral /> : item.averageScore !== null ? <SentimentVeryDissatisfied/> : null}
                                <Typography variant='subtitle2' fontWeight="600">{item.averageScore && `${item.averageScore}%`}</Typography>
                            </Box>
                            <Box>
                                <Typography variant='body2' mt="5px">{item.format === 'TV' ? "TV Show" : item.format} {item.episodes ? `\u2022 ${item.episodes} Episodes` : null} {item.duration ? `\u2022 ${item.duration} Minutes` : null}</Typography>
                            </Box>
                            <Typography variant='body2' mt="5px">Status: {item.status[0] + item.status.slice(1).toLowerCase()}</Typography>
                            <Box>
                                {item.genres.length > 0 ? 
                                (<Typography variant="body2" mt="5px">
                                Genre: {item.genres.map(genre => 
                                    <a key={genre} 
                                        //href={item.siteUrl} 
                                        href={`http://localhost:3000/search/${type}?genres=${genre}`}
                                        style= {{textDecoration: 'none'}}
                                    >
                                        {genre}
                                    </a>
                                    ).reduce((prev,curr) => [prev, ', ', curr])}
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
    )
}
