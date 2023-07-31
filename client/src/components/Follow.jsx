import React from 'react'
import { useNavigate } from "react-router-dom";
import { Avatar, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Button, Divider } from '@mui/material'
export default function Follow({open, handleClose, type, loggedUser, handleFollowUnfollow, arr}) {
    const navigate = useNavigate(); 
    return (
        <Dialog maxWidth={'sm'} open={open} onClose={handleClose} sx={{'& .MuiPaper-root': {alignItems: "center"}}}>
            <DialogTitle>{type === "following" ? "Following" : "Followers"}</DialogTitle>
            <DialogContent >
              {arr.length !== 0 ?
                <List >
                  {arr.map((user) => 
                    <React.Fragment key={user._id}>
                      <ListItem 
                        key={user._id} 
                        // secondaryAction={
                        //   <Button variant="contained"  size="small" aria-label={type === "following" ? "Following" : "Unfollow"}>
                        //     {type === "following" ? "Following" : "Unfollow"}
                        //   </Button>
                        // }
                      >
                        {/* onClick={(e) => handleFollowUnfollow(e.target.textContent)} */}
                        
                        <ListItemButton onClick={()=>{navigate(`/user/${user.userName}`); navigate(0)}}>
                          <ListItemAvatar>
                            <Avatar alt="profile picture" src={`http://localhost:5000/assets/${user.picturePath}`}/>
                          </ListItemAvatar>
                          <ListItemText primary={user.userName} secondary={`${user.firstName} ${user.lastName}`}/>
                        </ListItemButton>
                        {loggedUser._id !== user._id &&
                          <Button 
                            sx={{marginLeft: "5rem"}} 
                            variant="contained"  
                            size="small" 
                            aria-label={type === "following" ? "Following" : "Unfollow"}
                            onClick={(e) => handleFollowUnfollow(user._id)}
                          >
                              {type === "following" && loggedUser.following.includes(user._id) ? "Unfollow" :  loggedUser.following.includes(user._id) ? "Following" : "Follow"}
                          
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
