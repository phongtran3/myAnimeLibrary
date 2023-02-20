import React from 'react'
//import {Card, Typography, CardMedia, Button, ButtonBase} from "@mui/material"
import { ImageList, ImageListItem , ImageListItemBar } from '@mui/material';



export default function Media({media}) {
  //console.log(media);
  return (
    <ImageList cols={5} gap={48} sx={{textAlign: "center"}}>
      {media.map(anime => ( 
        <ImageListItem key={anime.id}>
        <a href={anime.siteUrl} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none', color: 'inherit'}}>
          <img
              src={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${anime.coverImage.large}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={anime.title.english === null ? anime.title.romaji : anime.title.english}
              loading="lazy"
              style={{borderRadius: "0.375rem", width: "230px", height: "326px"}}
          />
        <ImageListItemBar title={anime.title.english === null ? anime.title.romaji : anime.title.english}  position="below" sx={{maxWidth: "230px"}}/>
        </a>
      </ImageListItem>
      ))}
    </ImageList>
  )
}
