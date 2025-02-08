import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const HelpDialog = ({ open, onClose, title, overview, features, steps }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#1a237e', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Box component="span" sx={{ mr: 1 }}>❔</Box>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        {/* Overview Section */}
        <Typography variant="h6" gutterBottom>
          Overview
        </Typography>
        <Typography paragraph color="text.secondary">
          {overview}
        </Typography>

        {/* Key Features Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Key Features
        </Typography>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        {/* How to Use Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          How to Use
        </Typography>
        <List>
          {steps.map((step, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={`${index + 1}. ${step}`}
                sx={{ '& .MuiListItemText-primary': { color: 'text.secondary' } }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            bgcolor: '#556B2F',
            '&:hover': {
              bgcolor: '#4B5E29'
            }
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HelpDialog;
