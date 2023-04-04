import React, { useState, useRef, useCallback } from 'react'
import Filter from '../../components/Filter';
import NavBar from '../../components/NavBar'
import { Box } from '@mui/material';
import useAniMangaSearch from './useAniMangaSearch';


export default function SearchPage() {
  const [pageNumber, setPageNumber] = useState(1)

  const {loading, hasNextPage, aniMangas} = useAniMangaSearch(pageNumber);
  console.log(aniMangas);
  console.log(hasNextPage);
  console.log(pageNumber);

  const observer = useRef()
  console.log(observer);

  const lastAniMangaEleRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        console.log("Visable")
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
    console.log(node);
  }, [loading, hasNextPage])

  return (
    <>
      <NavBar />
      <Box maxWidth="1440px" margin="2em auto" sx={{"& .MuiTypography-root":{margin:".5em 0"}}}>
        <Box margin="0 2.5rem">
          <Filter />
        </Box>
        <Box>
          {aniMangas.map((aniManga, index) => {
            if (aniMangas.length === index + 1) {
              return (
              <>
              <div>testing</div>
              <div ref={lastAniMangaEleRef} key={aniManga.id}>{aniManga.title.english === null ? aniManga.title.romaji : aniManga.title.english}</div>
              </>
              )
            } else {
              return <div key={aniManga.id}>{aniManga.title.english === null ? aniManga.title.romaji : aniManga.title.english}</div>
            }

          })}

        </Box>
        <div>{loading && 'Loading...'}</div>


      </Box>
    </>
  )
}
