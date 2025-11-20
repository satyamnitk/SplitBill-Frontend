import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import FriendInput from "./FriendInput";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardContent,
  Container,
  createTheme,
  Grid,
  TextField,
  ThemeProvider,
  Typography,
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

    setNext((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        {!next ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    SplitBill
                  </Typography>
                  <Grid item xs={12}>
                    <TextField
                      label="Total Spend"
                      variant="outlined"
                      fullWidth
                      value={totalSpend}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!isNaN(value) && value >= 0) {
                          setTotalSpend(value);
                        }
                      }}
                      required
                    />
                  </Grid>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="medium"
                        style={{
                          fontSize: "0.75rem",
                          padding: "8px 16px",
                        }}
                        color={divideMethod === "equal" ? "primary" : "inherit"}
                        onClick={() => setDivideMethod("equal")}
                      >
                        Equal
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="medium"
                        style={{
                          fontSize: "0.75rem",
                          padding: "8px 16px",
                        }}
                        color={
                          divideMethod === "custom" ? "primary" : "inherit"
                        }
                        onClick={() => setDivideMethod("custom")}
                      >
                        Custom
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="medium"
                      style={{
                        fontSize: "0.75rem",
                        padding: "8px 16px",
                      }}
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <FriendInput
            group={group}
            totalSpend={totalSpend}
            setTotalSpend={setTotalSpend}
            divideMethod={divideMethod}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default AddExpense;
