import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Avatar, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Button, Divider } from '@mui/material'
import axios from 'axios'
export default function Follow({open, handleClose, type, user, loggedUser, handleFollowUnfollow}) {
    // const [followers, setFollowers] = useState([]);
    // const [following, setFollowing] = useState([]);
    const [array, setArray] = useState([]);
    const navigate = useNavigate(); 
    async function getFollowers(){
        await axios.get(`http://localhost:5000/users/${user._id}/follower`)
        .then(res =>{
            // setFollowers(res.data[0])
            // setFollowing(res.data[1])
            setArray(type === "following" ? res.data[1] : res.data[0])
          }).catch(err => {
            if (err.response){
              console.log(err.response.data);
            }
          console.log(err);
          }) 
    }

    useEffect(()=> {
        getFollowers();
    },[])

    return (
        <Dialog maxWidth={'sm'} open={open} onClose={handleClose} sx={{'& .MuiPaper-root': {alignItems: "center"}}}>
            <DialogTitle>{type === "following" ? "Following" : "Followers"}</DialogTitle>
            <DialogContent >
              {array.length != 0 ?
                <List >
                  {array.map((user) => 
                    <React.Fragment key={user._id}>
                      <ListItem 
                        key={user._id} 
                        // secondaryAction={
                        //   <Button variant="contained"  size="small" aria-label={type === "following" ? "Following" : "Unfollow"}>
                        //     {type === "following" ? "Following" : "Unfollow"}
                        //   </Button>
                        // }
                      >

                        <ListItemButton onClick={()=>{navigate(`/user/${user.userName}`); navigate(0)}}>
                          <ListItemAvatar>
                            <Avatar alt="profile picture" src={`http://localhost:5000/assets/${user.picturePath}`}/>
                          </ListItemAvatar>
                          <ListItemText primary={user.userName} secondary={`${user.firstName} ${user.lastName}`}/>
                        </ListItemButton>
                        {loggedUser._id != user._id &&
                          <Button sx={{marginLeft: "5rem"}} variant="contained"  size="small" aria-label={type === "following" ? "Following" : "Unfollow"}>
                              {type === "following" ? "Following" : "Unfollow"}
                          </Button>
                        } 
                      </ListItem>
                      <Divider variant="inset" component="li"/>        
                        
                    </React.Fragment>
                  )}
                </List>
              : type === "following" ? "User currently is not following anyone": "User currently does not have any followers"
            }
            </DialogContent>
        </Dialog>
    )
}
