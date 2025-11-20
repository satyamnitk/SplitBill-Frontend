import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FriendInput from "./FriendInput";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardContent,
  createTheme,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
  Box,
} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const AddExpense = () => {
  const location = useLocation();
  const { group } = location.state || {};
  const [totalSpend, setTotalSpend] = useState("");
  const [divideMethod, setDivideMethod] = useState("");
  const [next, setNext] = useState(false);

  const handleNext = () => {
    if (!totalSpend || !divideMethod) {
      toast.error("Complete all the fields first.");
      return;
    }
    setNext(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
          background: "linear-gradient(135deg, #90caf9, #ce93d8)",
        }}
      >
        {!next ? (
          <Card
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 500,
              borderRadius: 4,
              p: 3,
              background: "#ffffff",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={700}
                textAlign="center"
                mb={3}
              >
                Add Expense
              </Typography>

              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <TextField
                    label="Total Spend"
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                    fullWidth
                    value={totalSpend}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(value) && value >= 0) setTotalSpend(value);
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography fontWeight={600} mb={1}>
                    Split Method
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      width: "100%",
                    }}
                  >
                    <Button
                      fullWidth
                      variant={divideMethod === "equal" ? "contained" : "outlined"}
                      color="inherit"
                      sx={{ borderRadius: 3 }}
                      onClick={() => setDivideMethod("equal")}
                    >
                      Equal
                    </Button>

                    <Button
                      fullWidth
                      variant={divideMethod === "custom" ? "contained" : "outlined"}
                      color="inherit"
                      sx={{ borderRadius: 3 }}
                      onClick={() => setDivideMethod("custom")}
                    >
                      Custom
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="medium"
                    onClick={handleNext}
                    sx={{ borderRadius: 3 }}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <FriendInput
            group={group}
            totalSpend={totalSpend}
            setTotalSpend={setTotalSpend}
            divideMethod={divideMethod}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AddExpense;
