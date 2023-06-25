import React, { useState, useRef, useCallback } from 'react'
import PropTypes from "prop-types";
import BrowseFilter from '../../components/BrowseFilter';
import NavBar from '../../components/NavBar'
import { Box, ImageList, LinearProgress, useScrollTrigger, Fab, Zoom, Toolbar, Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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


  function ScrollToTop(props){
    const {children} = props;
    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 100
    });

    function handleClick (event) {
      const anchor = (event.target.ownerDocument || document).querySelector("#back-to-top-anchor");
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return (
      <Zoom in={trigger}>
        <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 16, right: 16 }} >
          {children}
        </Box>
      </Zoom>
    );
  }
  ScrollToTop.propTypes = {children: PropTypes.element.isRequired};



  return (
    <Box>
      <NavBar />
      <Toolbar id="back-to-top-anchor" />

      <Box 
        maxWidth="1520px" 
        margin="0 auto" 
        sx={{
          "& .MuiTypography-root":{
            margin:".5em 0"
            }
        }}
      >



        <Box margin="0 2rem 2rem">
            <h1>Filter</h1>
            <BrowseFilter />
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


        <Box sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
          <ImageList 
            sx={{
              textAlign: "center", 
              gap:"2rem !important",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr)) !important",
              "& div":{
                display:"flex",
              }
            }}
          
          
          >
            {aniMangas.map((item, index) => {
              if (aniMangas.length - 10 === index + 1) {
                return (
                  <div ref={lastAniMangaEleRef} key={item.id}>
                    <Card item={item} />
                  </div>
                )
              } else {
                return (
                <div key={item.id}>
                  <Card item={item} />
                </div>)
              }
            })}
          </ImageList>
        </Box>
      {/* <Grid container justifyContent="flexStart" alignItems="stretch" spacing={4} sx={{ width: 'auto', margin: '0 2.5rem',}}>
        Large screen gap 72 / small screen 48
        <ImageList cols={5} sx={{textAlign: "center", gap:"20px 72px !important" }}>
          {aniMangas.map((item, index) => {
            if (aniMangas.length - 10 === index + 1) {
              return (
                <div ref={lastAniMangaEleRef} key={item.id}>
                  <Card item={item} />
                </div>
              )
            } else {
              return (
              <div key={item.id}>
                <Card item={item} />
              </div>)
            }
          })}
        </ImageList>
      </Grid> */}
      <div>{loading && <LinearProgress />}</div>

      </Box>

      <ScrollToTop>  
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollToTop>   

    </Box>
  )
}
