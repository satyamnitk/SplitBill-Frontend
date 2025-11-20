import React, { useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  Card,
  CardContent,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const StyledDialog = ({ open, onClose, title, isMobile, children }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="xs"
    fullScreen={isMobile}
    slotProps={{
      paper: {
        sx: {
          borderRadius: isMobile ? 0 : 4,
          p: 2,
          boxShadow: 8,
          width: isMobile ? "100%" : 420,
          maxWidth: "90vw",
        },
      },
    }}
  >
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{ position: "absolute", right: 8, top: 10, zIndex: 10 }}
    >
      <CloseIcon />
    </IconButton>

    <DialogTitle sx={{ pr: 5, textAlign: "center", fontWeight: 600 }}>
      {title}
    </DialogTitle>

    <DialogContent dividers>{children}</DialogContent>
  </Dialog>
);

const InputGroupField = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [groupName, setGroupName] = useState("");
  const [friendEmailInput, setFriendEmailInput] = useState("");
  const [friendNameInput, setFriendNameInput] = useState("");
  const [foundName, setFoundName] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!userData) return <div>User data not found.</div>;

  const isAlreadyAdded = (email) => members.some((m) => m.email === email);

  const handleFindUser = async () => {
    if (!groupName) return toast.error("Please enter a group name.");
    if (!friendEmailInput) return toast.error("Please enter an email address.");
    if (friendEmailInput === userData.email)
      return toast.error("You are already part of this group.");
    if (isAlreadyAdded(friendEmailInput))
      return toast.error("This email is already added to your group.");

    setLoading(true);
    setNotFound(false);
    setFoundName("");
    setFriendNameInput("");
    setInviteSent(false);

    try {
      const response = await axios.post(`${apiUrl}/find-user`, {
        email: friendEmailInput,
      });

      if (response.status === 200 && response.data) {
        setFoundName(response.data.name);
        toast.success(`Account found: ${response.data.name}`);
      } else {
        setNotFound(true);
        setInviteDialogOpen(true);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        setInviteDialogOpen(true);
      } else {
        toast.error("Unable to search for this email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!friendEmailInput) return toast.error("Enter an email to send invite.");
    if (!friendNameInput && !foundName)
      return toast.error("Please enter your friend's name.");

    setInviteSending(true);

    try {
      const res = await axios.post(`${apiUrl}/send-invite`, {
        email: friendEmailInput,
        inviterId: userData._id,
        groupName,
        name: friendNameInput || foundName || undefined,
      });

      if (res.status === 200) {
        toast.success("Invitation sent successfully.");
        setInviteSent(true);
        setInviteDialogOpen(false);
      } else {
        toast.error("Failed to send invitation.");
      }
    } catch {
      toast.error("Unable to send invite. Please try again.");
    } finally {
      setInviteSending(false);
    }
  };

  const handleAddFriend = () => {
    if (!friendEmailInput) return toast.error("Please enter an email.");

    const finalName = foundName || friendNameInput;

    if (!finalName)
      return toast.error("Please enter your friend's name.");

    if (isAlreadyAdded(friendEmailInput))
      return toast.error("This email is already added.");

    if (notFound && !inviteSent) {
      return toast.error("Please send an invite before adding this friend.");
    }

    setMembers([...members, { email: friendEmailInput, name: finalName }]);

    toast.success("Friend has been added to your group.");

    setFriendEmailInput("");
    setFriendNameInput("");
    setFoundName("");
    setNotFound(false);
    setInviteSent(false);
  };

  const handleRemoveFriend = (email) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
  };

  const handleCreateGroup = async () => {
    if (!groupName) return toast.error("Please enter a group name.");
    if (members.length === 0)
      return toast.error("Add at least one friend before creating the group.");

    setLoading(true);

    const currentUserName =
      userData.name ||
      (userData.email ? userData.email.split("@")[0] : "You");

    const groupData = {
      groupName,
      createdBy: userData._id,
      members: [
        ...members.map((m) => ({
          name: m.name,
          email: m.email,
        })),
        {
          name: currentUserName,
          email: userData.email,
        },
      ],
    };

    try {
      const response = await axios.post(`${apiUrl}/create-group`, groupData);

      if (response.status === 201) {
        toast.success("Your group has been created successfully!");
        setGroupName("");
        setMembers([]);
        setDialogOpen(false);
      } else {
        toast.error("Failed to create group.");
      }
    } catch {
      toast.error("Unable to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAddFriend =
    !!friendEmailInput &&
    (!!foundName || (notFound && inviteSent && !!friendNameInput));

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              background: "linear-gradient(135deg, #90caf9, #ce93d8)",
              px: 1,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 600 }}>
              <Card
                elevation={10}
                sx={{
                  borderRadius: 4,
                  p: { xs: 2, sm: 5 },
                  backgroundColor: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={3}
                    textAlign="center"
                  >
                    Create a New Group
                  </Typography>

                  <Grid container spacing={3} direction="column">
                    <Grid item xs={12}>
                      <TextField
                        label="Group Name"
                        required
                        fullWidth
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Friend's Email"
                        required
                        fullWidth
                        value={friendEmailInput}
                        onChange={(e) => setFriendEmailInput(e.target.value)}
                        helperText="* Enter the email to check if the user is registered on SplitBill."
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>

                    {foundName && (
                      <Grid item xs={12}>
                        <TextField
                          label="Friend's Name"
                          fullWidth
                          value={foundName}
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 3 },
                          }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleFindUser}
                        >
                          Find Friend
                        </Button>

                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={handleAddFriend}
                          disabled={!canAddFriend}
                        >
                          Add Friend
                        </Button>
                      </Box>
                    </Grid>

                    {foundName && (
                      <Grid item xs={12}>
                        <Typography>
                          Account Found: <strong>{foundName}</strong>
                        </Typography>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => setDialogOpen(true)}
                      >
                        Added Friends
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleCreateGroup}
                      >
                        Create Group
                      </Button>
                    </Grid>
                  </Grid>

                  <StyledDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    title="Friends Added to Group"
                    isMobile={isMobile}
                  >
                    {members.length === 0 ? (
                      <Typography>No friends added yet.</Typography>
                    ) : (
                      <List>
                        {members.map(({ email, name }) => (
                          <ListItem
                            key={email}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => handleRemoveFriend(email)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={name ? `${name} (${email})` : email}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </StyledDialog>

                  <StyledDialog
                    open={inviteDialogOpen}
                    onClose={() => setInviteDialogOpen(false)}
                    title="No Account Found"
                    isMobile={isMobile}
                  >
                    <Typography mb={1}>
                      No account found. You can send an invite.
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={2}
                    >
                      You’ll need a SplitBill account to use transaction
                      features.
                    </Typography>

                    <TextField
                      fullWidth
                      label="Friend's Name"
                      value={friendNameInput}
                      onChange={(e) => setFriendNameInput(e.target.value)}
                      sx={{ mt: 1 }}
                    />

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3 }}
                      disabled={inviteSending}
                      onClick={handleSendInvite}
                    >
                      {inviteSending ? "Sending..." : "Send Invite"}
                    </Button>
                  </StyledDialog>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default InputGroupField;
