import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", otp: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.password) return toast.error("Complete all the fields first.");
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/register`, formData);
      if (response.status === 201) {
        setLoading(false);
        toast.success("Signup successful.");
        setFormData({ name: "", email: "", otp: "", password: "" });
        navigate("/users/login");
      }
    } catch {
      setLoading(false);
      toast.error("Unable to create an account.");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!formData.email) return toast.error("Complete all the fields first.");
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/send-otp`, { email: formData.email });
      if (response.status === 200) {
        setLoading(false);
        setOtpSent(true);
        toast.success("OTP sent successfully.");
      }
    } catch {
      setLoading(false);
      toast.error("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) return toast.error("Complete all the fields first.");
    if (!/^[0-9]{6}$/.test(formData.otp)) return toast.error("OTP must be 6 digits.");
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/verify-otp`, { email: formData.email, otp: formData.otp });
      if (response.status === 200) {
        setLoading(false);
        setOtpVerified(true);
        toast.success("OTP verified successfully.");
      }
    } catch {
      setLoading(false);
      toast.error("Invalid OTP.");
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
                maxWidth: 600,
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
                  textAlign: "center",
                  mb: 4,
                }}
              >
                Create your account to get started and explore our features.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                {!otpVerified && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={otpSent}
                      required
                      fullWidth
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendOtp}
                      sx={{ py: 1, borderRadius: 3 }}
                    >
                      {!otpSent ? "Send OTP" : "Resend OTP"}
                    </Button>
                  </Box>
                )}

                {otpSent && !otpVerified && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                    <TextField
                      label="Enter OTP"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleVerifyOtp}
                      sx={{ py: 1, borderRadius: 3 }}
                    >
                      Verify OTP
                    </Button>
                  </Box>
                )}

                {otpVerified && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    />
                    <Button fullWidth variant="contained" color="primary" type="submit" sx={{ py: 1, borderRadius: 3 }}>
                      Submit
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default Register;
