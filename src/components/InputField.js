import React, { useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import FriendInput from "./FriendInput";
import { toast } from "react-toastify";

const InputField = ({ storedUserData }) => {
  const [totalSpend, setTotalSpend] = useState("");
  const [totalFriends, setTotalFriends] = useState("");
  const [divideMethod, setDivideMethod] = useState("");
  const [next, setNext] = useState(false);

  const handleChange = (event, field) => {
    const value = event.target.value;

    if (field === "spend") {
      if (/^[1-9]\d*$/.test(value) || value === "") {
        setTotalSpend(value);
      } else {
        toast.error("Bill should be an integer not starting with 0.");
        return;
      }
    } else {
      if (/^[1-9]\d*$/.test(value) || value === "") {
        setTotalFriends(value);
      } else {
        toast.error("Number should be an integer not starting with 0.");
        return;
      }
    }
  };

  const handleNext = () => {
    if (!totalSpend || !totalFriends || !divideMethod) {
      toast.error("Complete all the fields first.");
      return;
    }
    setNext((prev) => !prev);
  };

  return (
    <>
      {!next && (
        <>
          <Typography m={3} variant="h4" gutterBottom>
            SplitBill
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Total Spend"
                variant="outlined"
                fullWidth
                value={totalSpend}
                onChange={(event) => handleChange(event, "spend")}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[1-9][0-9]*",
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Number of Friends"
                variant="outlined"
                fullWidth
                value={totalFriends}
                onChange={(event) => handleChange(event, "friends")}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[1-9][0-9]*",
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                color={divideMethod === "equal" ? "primary" : "inherit"}
                onClick={() => setDivideMethod("equal")}
              >
                Equal Split
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                color={divideMethod === "custom" ? "primary" : "inherit"}
                onClick={() => setDivideMethod("custom")}
              >
                Custom Split
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </Grid>
        </>
      )}

      {next && (
        <FriendInput
          storedUserData={storedUserData}
          totalSpend={parseInt(totalSpend)}
          setTotalSpend={setTotalSpend}
          totalFriends={parseInt(totalFriends)}
          setTotalFriends={setTotalFriends}
          divideMethod={divideMethod}
          setDivideMethod={setDivideMethod}
          setNext={setNext}
        />
      )}
    </>
  );
};

export default InputField;
