import React, { useState } from "react";
import { Button, Typography, Box, Paper, createTheme, ThemeProvider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Loader";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!userData) {
    return <div>User data not found.</div>;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await api.get("/logout");
      if (response.status === 200) {
        toast.success("Logout successfully.");
        localStorage.removeItem("userData");
        navigate("/users/login", { replace: true });
      }
    } catch {
      toast.error("Unable to logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "linear-gradient(135deg, #90caf9, #ce93d8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 2,
              boxSizing: "border-box",
            }}
          >
            <Paper
              elevation={10}
              sx={{
                borderRadius: 4,
                padding: { xs: 4, sm: 6 },
                width: "100%",
                maxWidth: 500,
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  mb: 4,
                  textAlign: "center",
                }}
              >
                Welcome, {userData.name}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={handleLogout}
                  sx={{ borderRadius: 3, py: 1 }}
                >
                  Logout
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate("/users/create-group")}
                  sx={{ borderRadius: 3, py: 1 }}
                >
                  Create New Group
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  onClick={() => navigate("/users/groups")}
                  sx={{ borderRadius: 3, py: 1 }}
                >
                  Your Groups
                </Button>
              </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default Dashboard;
