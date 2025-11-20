import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const Loader = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" mt={2} fontSize="h6.fontSize">
          Please wait...
        </Typography>
        <Typography
          variant="body1"
          mt={2}
          fontSize="h5.fontSize"
          color={"blue"}
        >
          SplitBill
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Loader;
