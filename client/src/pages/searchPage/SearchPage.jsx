import React, { useState, useRef, useCallback } from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { Box } from '@mui/material';
import useAniMangaSearch from './useAniMangaSearch';
import MediaList from '../../components/MediaList';

import {ImageList, ImageListItem , ImageListItemBar, Typography, Paper, Popper, Fade } from '@mui/material';
import PopupState, {bindPopover, bindHover, bindToggle, bindPopper} from "material-ui-popup-state";
import {SentimentNeutral, SentimentSatisfiedAlt, SentimentVeryDissatisfied } from "@mui/icons-material";
import { useSelector } from "react-redux";
import QuickAction from '../../components/QuickAction';


export default function SearchPage() {
  const user = useSelector((state) => state.user);

  const [pageNumber, setPageNumber] = useState(1)

  const {loading, hasNextPage, aniMangas} = useAniMangaSearch(pageNumber);
  //console.log(aniMangas);
  //console.log(hasNextPage);
  //console.log(pageNumber);

  const observer = useRef()
  //console.log(observer);

  const lastAniMangaEleRef = useCallback(node => {
    //console.log("last ele");
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        //console.log("Visable")
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
    //console.log(node);
  }, [loading, hasNextPage])

  return (
    <>
      <NavBar />
      <Box maxWidth="1440px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>
        <Box margin="0 2.5rem">
          <Filter />
        </Box>

        {/* <Box margin="0 2.5rem">
          {aniMangas.map((aniManga, index) => {
            if (aniMangas.length === index + 1) {
              return <div ref={lastAniMangaEleRef} key={aniManga.id}>{aniManga.title.english === null ? aniManga.title.romaji : aniManga.title.english}</div>
            } else {
              return <div key={aniManga.id}>{aniManga.title.english === null ? aniManga.title.romaji : aniManga.title.english}</div>
            }

          })}
        </Box> */}
        
        <div>{loading && 'Loading...'}</div>
        {/* <MediaList  media={aniMangas}/> */}
        <ImageList cols={5} gap={48} sx={{textAlign: "center"}}>
          {aniMangas.map((anime, index) => {
            if (aniMangas.length - 8 === index + 1) {
              return <div ref={lastAniMangaEleRef} key={anime.id}>
              <p>test</p>
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
            </div>
            } else {
              return <div key={anime.id}>
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
            </div>
            }
        })}
        </ImageList>




      </Box>
    </>
  )
}
