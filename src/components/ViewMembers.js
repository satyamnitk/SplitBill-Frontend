import { ThemeProvider } from "@emotion/react";
import {
  Button,
  Card,
  CardContent,
  Container,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const ViewMembers = () => {
  const location = useLocation();
  const { group } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false); // Dialog state for adding a new member
  const [newMemberEmail, setNewMemberEmail] = useState(""); // State to store email input

  // Function to handle adding member
  const handleAddMember = () => {
    if (!newMemberEmail) {
      // Handle error if no email is provided
      alert("Please enter a valid email address.");
      return;
    }

    // Logic to add the member (you can replace this with your actual API call)
    console.log("Adding member with email:", newMemberEmail);
    setOpenDialog(false); // Close the dialog after adding the member
    setNewMemberEmail(""); // Clear the email field
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          {/* Display Group Name */}
          <Typography variant="h4" gutterBottom>
            Group: {group.groupName}
          </Typography>

          {/* Display Created By Info */}
          <Typography variant="h6" gutterBottom>
            Created By: {group.createdBy.name} ({group.createdBy.email})
          </Typography>

          {/* Button to open dialog to add a member */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            sx={{ marginBottom: 2 }}
          >
            Add Member
          </Button>

          {/* Display Group Members */}
          <Typography variant="h6" gutterBottom>
            Members:
          </Typography>

          <Grid container spacing={2}>
            {group.members.map((member, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card elevation={3} sx={{ position: "relative", padding: 3 }}>
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="body2" fontWeight="bold">
                          Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{member.name}</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="body2" fontWeight="bold">
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{member.email}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* Place the Delete Icon at the bottom right */}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    // onClick={() => handleRemoveFriend(member._id)}
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 15,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Dialog to add a new member */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm" // 'sm' will set a small max width, you can use 'md' or 'lg' for larger dialogs
          fullWidth
        >
          <DialogTitle>Add a New Member</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Member Email"
              type="email"
              fullWidth
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddMember} color="primary">
              Add Member
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default ViewMembers;
