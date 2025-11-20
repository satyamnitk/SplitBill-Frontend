import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Box,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f9f9fc" },
  },
  typography: {
    fontFamily: '"Poppins", "Comfortaa", sans-serif',
    button: {
      textTransform: "none",
      fontSize: "0.8rem",
      fontWeight: 500,
    },
  },
});

const Groups = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const userGroups = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${apiUrl}/groups`, {
          _id: userData._id,
          email: userData.email,
        });
        if (response.status === 200) {
          setGroups(response.data.groups);
          toast.success("Groups loaded successfully!");
        }
      } catch {
        toast.error("Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };

    userGroups();
  }, []);

  if (!userData) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          typography: "h6",
        }}
      >
        User data not found.
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          py: { xs: 3, md: 5 },
          px: { xs: 2, sm: 4, md: 8 },
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: { xs: 3, md: 5 },
            color: "primary.main",
          }}
        >
          Your Groups
        </Typography>

        {loading ? (
          <Loader />
        ) : groups.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            You haven’t joined or created any groups yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {groups.map((group, index) => (
              <Grid
                item
                xs={12}      // mobile: 1 per row
                sm={6}       // tablet: 2 per row
                md={4}       // laptop+: 3 per row
                key={index}
                sx={{ display: "flex" }}
              >
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 5,
                    },
                    width: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {group.groupName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Created By:{" "}
                      <strong>
                        {group.createdBy._id === userData._id
                          ? "You"
                          : group.createdBy.name}
                      </strong>
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 1,
                      p: 2,
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                    }}
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      color="inherit"
                      onClick={() =>
                        navigate("/users/groups/add-expense", {
                          state: { group },
                        })
                      }
                    >
                      Add Expense
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      color="inherit"
                      onClick={() =>
                        navigate("/users/groups/view-expenses", {
                          state: {
                            groupId: group._id,
                            groupName: group.groupName,
                            userId: userData._id,
                            userName: userData.name,
                          },
                        })
                      }
                    >
                      View Expenses
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      color="inherit"
                      onClick={() =>
                        navigate("/users/groups/view-members", {
                          state: { group },
                        })
                      }
                    >
                      View Members
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Groups;
