import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Alert  } from '@mui/material'




export default function ConfirmPassword({open, handleClose, setBody, handleSave, error}) {


  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Current Password</DialogTitle>
        <DialogContent>
          <DialogContentText> Please enter your current password to confirm these changes.</DialogContentText>
          <TextField
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
          {error ? <Alert severity="error" > {error}</Alert> : null }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Submit</Button>
        </DialogActions>
      </Dialog>
  )
}
