import React, { useState, useRef, useCallback } from 'react'
import PropTypes from "prop-types";
import BrowseFilter from '../../components/BrowseFilter';
import NavBar from '../../components/NavBar'
import { Box, ImageList, LinearProgress, useScrollTrigger, Fab, Zoom, Toolbar, Alert, Snackbar, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useAniMangaSearch from './useAniMangaSearch';
import Card from '../../components/Card';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function SearchPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const {loading, hasNextPage, aniMangas, isAdult} = useAniMangaSearch(pageNumber);
  const [alert, setAlert] = useState("");
  const loggedUser = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);
  const params = useParams();
  const type = params.media;
  console.log(isAdult);
  console.log(aniMangas);
  //console.log(hasNextPage);
  //console.log(pageNumber);

  const observer = useRef()
  //console.log(observer);

  const lastAniMangaEleRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
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

  const array = loggedUser && loggedUser.isAdult ? aniMangas :  
      aniMangas.reduce(function(filtered, item){
        if(!item.isAdult){
          filtered.push(item)
        }
        return filtered
      }, [])

  //console.log(array);
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
        <Snackbar 
          id="snackbar"
          open={alert != "" ? true : false} 
          autoHideDuration={3000}
          sx={{
            top:"5rem !important",
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={(e,reason) => {
            if (reason === 'clickaway') {
              return;
            }
            setAlert("")
          }}
        >
          <Alert 
            onClose={(e,reason) => {
              if (reason === 'clickaway') {
                return;
              }
              setAlert("")
            }} 
            severity="success" 
            sx={{ width: '100%' }}
        >
          {alert}
        </Alert>
        </Snackbar>
        
        <Box margin="0 2rem 2rem">
            <BrowseFilter />
        </Box>
        <Box id="main-content" sx={{ width: 'auto', margin: '0rem 2rem 3rem 2rem'}}>
          {isAdult ?
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography fontWeight="bold">FOR ADULT CONTENT. PLEASE LOG IN AND GO TO THE SETTING PAGE</Typography>
            </Box>
          
          :
          
          aniMangas.length === 0 ?
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography fontWeight="bold">NO RESULTS</Typography>
            </Box>
            :
            <ImageList 
            sx={{
              overflowY: "visible !important",
              textAlign: "center", 
              gap:"3rem 2rem !important",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr)) !important",
              '@media (max-width: 500px)': {
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))!important',
              },
              "& > div":{
                display:"flex",
                //transition: "transform 250ms",
                // '&:hover':{
                //   transform: "scale(1.05)"
                // },
              }
            }}
          >
            {array.map((item, index) => {
              if (array.length - 10 === index + 1) {
                return (
                  <div ref={lastAniMangaEleRef} key={item.id}>
                    <Card type={type} mode={mode} item={item} setAlert={setAlert} />
                  </div>
                )
              } else {
                return (
                <div key={item.id}>
                  <Card type={type} mode={mode} item={item} setAlert={setAlert} />
                </div>)
              }
            })}
          </ImageList>    
        }
        </Box>
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
