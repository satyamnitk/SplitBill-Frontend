import React, { useEffect, useState } from "react";
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

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await api.get("/check-auth");
        if (response.status === 200) {
          const userData = response.data.user;
          setLoading(false);
          toast.success("You are already logged in.");
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/users/dashboard");
        }
      } catch {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", formData);
      if (response.status === 200) {
        const userData = response.data.user;
        toast.success("You have logged in successfully.");
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/users/dashboard");
      }
    } catch {
      toast.error("Invalid credentials.");
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
                Login to access your account and explore our features.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="current-password"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth sx={{ py: 1, borderRadius: 3 }}>
                  Login
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    cursor: "pointer",
                    color: "primary.main",
                    textDecoration: "underline",
                    alignSelf: "flex-end",
                  }}
                  onClick={() => navigate("/users/forgot-password")}
                >
                  Forgot password?
                </Typography>
              </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default Login;
