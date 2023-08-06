import React, {useState} from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Alert, IconButton, InputAdornment  } from '@mui/material'
import {Visibility, VisibilityOff} from "@mui/icons-material"

export default function ConfirmPassword({open, handleClose, setBody, handleSave, error, palette}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const handleShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);

  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Current Password</DialogTitle>
        <DialogContent>
          <DialogContentText> Please enter your current password to confirm these changes.</DialogContentText>
          <TextField
            sx={{
              color:"red",
              ".MuiFormLabel-root.Mui-focused ":{
                color:palette.primary.dark,
              },
              ".MuiInputBase-root::after":{
                borderColor: palette.primary.dark,
              }
            }}
            autoFocus
            margin="dense"
            id="name"
            label="Current Password"
            type={showCurrentPassword ? "text": "password"}
            fullWidth
            variant="standard"
            onKeyDown={(e) => {
              if(e.key === 'Enter') 
                handleSave();
            }}
            onChange={(e) => setBody(prev => ({
              ...prev,
              currentPassword: e.target.value}
            ))}
            InputProps={{
              endAdornment: 
              <InputAdornment position="end">
                  <IconButton onClick={handleShowCurrentPassword}>
                  {!showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
              </InputAdornment>
            }}
          />
          {error ? 
            <Alert 
              variant="outlined" 
              severity="error" 
              sx={{
                  margin:".75rem 0",
                  borderWidth: "2px",
                  //color:"#b71c1c",
                  fontWeight: "600",
              }}
            > 
              {error}
            </Alert>  : null }
        </DialogContent>
        <DialogActions
          sx={{
            ".MuiButtonBase-root":{
              color: palette.primary.dark,
              "&:hover":{
                  backgroundColor:"rgba(103, 58, 183, 0.4);"
            }},
          }}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Submit</Button>
        </DialogActions>
      </Dialog>
  )
}
