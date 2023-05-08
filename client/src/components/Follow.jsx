import React, {useState, useEffect} from 'react'
import { Avatar, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import axios from 'axios'
export default function Follow({open, handleClose, type, user}) {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);


    async function getFollowers(){
        console.log(user._id)
        await axios.get(`http://localhost:5000/users/${user._id}/follower`)
        .then(res =>{
            console.log(res.data);
          }).catch(err => {
            if (err.response){
              console.log(err.response.data);
            }
          console.log(err);
          }) 
    }

    useEffect(()=> {
        console.log("Follow useEffect");
        getFollowers();
    },[])

    return (
        <Dialog maxWidth={'sm'} open={open} onClose={handleClose}>
            <DialogTitle>{type === "following" ? "Following" : "Followers"}</DialogTitle>
            <DialogContent>


            </DialogContent>
        </Dialog>
    )
}
