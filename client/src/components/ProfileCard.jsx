import React from 'react'
import {Card, CardContent, Avatar, Divider} from '@mui/material'

export default function ProfileCard({firstName, lastName, userName, animes, mangas, picturePath}) {
    console.log(picturePath);
    return (
        <Card sx={{}}>
             <CardContent>
                <Avatar sx={{ width: 60, height: 60 }} src={`http://localhost:5000/assets/${picturePath}`} />
             </CardContent>
        </Card>
    )
}
