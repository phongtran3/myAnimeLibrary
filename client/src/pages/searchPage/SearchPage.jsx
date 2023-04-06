import React, { useState, useRef, useCallback } from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { Box, ImageList, LinearProgress } from '@mui/material';
import useAniMangaSearch from './useAniMangaSearch';
import Card from '../../components/Card';

export default function SearchPage() {
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
        
        <ImageList cols={5} gap={48} sx={{textAlign: "center"}}>
          {aniMangas.map((anime, index) => {
            if (aniMangas.length - 8 === index + 1) {
              return (
                <div ref={lastAniMangaEleRef} key={anime.id}>
                  <Card anime={anime} />
                </div>
              )
            } else {
              return (
              <div key={anime.id}>
                <Card anime={anime} />
              </div>)
            }
          })}
        </ImageList>
        <div>{loading && <LinearProgress />}</div>




      </Box>
    </>
  )
}
