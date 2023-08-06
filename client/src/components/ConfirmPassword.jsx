import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Alert  } from '@mui/material'


export default function ConfirmPassword({open, handleClose, setBody, handleSave, error, palette}) {
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
            type="password"
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
