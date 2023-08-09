import React from 'react'
import { useNavigate } from "react-router-dom";
import { Avatar, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Button, 
  Divider, useMediaQuery, IconButton, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";

export default function Follow({open, handleClose, type, loggedUser, handleFollowUnfollow, arr}) {
    const navigate = useNavigate(); 
    const mode = useSelector((state) => state.mode);
    const fullScreen = useMediaQuery('(max-width:500px)');
    return (
        <Dialog 
          maxWidth={'xs'} 
          open={open} 
          fullScreen={fullScreen}
          onClose={handleClose} 
          sx={{
            "& .MuiPaper-root": {
              alignItems: "center",
            },
          }}
        >
            <DialogTitle>
              {type === "following" ? "Following" : "Followers"}
              <IconButton
                aria-label="close"
                onClick={handleClose} 
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent 
              sx={{
                "& .MuiButtonBase-root.MuiListItemButton-root:hover":{
                  backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.1)" : null
                },
              }}
            >
              {arr.length !== 0 ?
                <List >
                  {arr.map((user) => 
                    <React.Fragment key={user._id}>
                      <ListItem 
                        id="item"
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
                            <Avatar alt="profile picture" src={`https://myanimelibrary.onrender.com/assets/${user.picturePath}`}/>
                          </ListItemAvatar>
                          <ListItemText primary={user.userName} secondary={`${user.firstName} ${user.lastName}`}/>
                        </ListItemButton>
                        {loggedUser._id !== user._id &&
                          <Button 
                            sx={{marginLeft: fullScreen ? "1rem" : "5rem"}} 
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
