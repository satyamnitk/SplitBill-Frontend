import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const ForgotPassword = () => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", {
        email: forgotEmail,
        newPassword,
      });
      if (res.status === 200) {
        toast.success(res.data?.message || "Password reset successful");
        navigate("/users/login");
      } else {
        toast.error(res.data?.message || "Failed to reset password");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to reset password";
      toast.error(msg);
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
                padding: { xs: 3, sm: 6 },
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
                variant="subtitle1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  color: "#333",
                  fontWeight: 600,
                  mb: 4,
                }}
              >
                Reset your password
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ py: 1, borderRadius: 3 }}>
                  Reset Password
                </Button>
                <Button variant="text" onClick={() => navigate("/users/login")}>
                  Back to Login
                </Button>
              </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default ForgotPassword;
