import React from "react";
import { Grid, Button, Typography, Box, Paper } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: '"Comfortaa", "Poppins", sans-serif',
    h4: { fontWeight: 700 },
  },
});

const Home = () => {
  const navigate = useNavigate();

  return (
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={10}
            sx={{
              borderRadius: 4,
              padding: { xs: 4, sm: 6 },
              width: "100%",
              maxWidth: 500,
              margin: "0 auto",
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontSize: { xs: "1.8rem", sm: "2.4rem" }, mb: 3 }}
            >
              SplitBill 💸
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: { xs: "0.95rem", sm: "1.1rem" } }}
            >
              Effortlessly split expenses with your friends. <br />
              Quick. Simple. Hassle-free.
            </Typography>

            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    py: 1.2,
                    fontSize: "1rem",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
                    },
                  }}
                  onClick={() => navigate("/users/register")}
                >
                  Register
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  size="large"
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    py: 1.2,
                    fontSize: "1rem",
                    borderWidth: 2,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      borderWidth: 2,
                      boxShadow: "0 4px 20px rgba(156, 39, 176, 0.4)",
                    },
                  }}
                  onClick={() => navigate("/users/login")}
                >
                  Already Registered? Login Here
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default Home;