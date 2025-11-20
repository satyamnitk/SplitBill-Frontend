import React, { useRef, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const FriendInput = ({ group, totalSpend, setTotalSpend, divideMethod }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalFriends = group.members.length;
  const [friends, setFriends] = useState(() => {
    const billAmount =
      divideMethod === "equal" ? Number(totalSpend) / totalFriends : "";

    return group.members.map((member) => ({
      userId: member.userId,
      name: member.name,
      email: member.email,
      bill: billAmount,
    }));
  });
  const [paidBy, setPaidBy] = useState("");
  const total = useRef(totalSpend);
  const navigate = useNavigate();

  const handleFriendChange = (event) => {
    const newFriends = friends.map((friend, index) => {
      if (index === currentIndex) {
        return { ...friend, bill: event.target.value };
      }
      return friend;
    });

    setFriends(newFriends);
  };

  const handleNext = () => {
    setTotalSpend((prev) => Number(prev) - Number(friends[currentIndex].bill));

    if (currentIndex < totalFriends - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setTotalSpend(
        (prev) => Number(prev) + Number(friends[currentIndex - 1].bill)
      );
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePaid = () => {
    setPaidBy(friends[currentIndex].userId);
    toast.success(`Bill paid by ${friends[currentIndex].name}.`);
  };

  const handleSubmit = async () => {
    const newTotalSpend =
      Number(totalSpend) - Number(friends[currentIndex].bill);

    if (Number(newTotalSpend) !== 0) {
      toast.error("Total spend should be 0 after all bill splitting.");
      return;
    }

    if (!paidBy) {
      toast.error("Please select a member who has paid.");
      return;
    }

    const simplifiedFriends = [
      ...friends.map((friend) => ({
        userId: friend.userId,
        bill: Number(friend.bill),
      })),
    ];

    try {
      const response = await axios.post(`${apiUrl}/groups/add-expense`, {
        groupId: group._id,
        paidBy,
        total: Number(total.current),
        splits: simplifiedFriends,
      });

      if (response.status === 201) {
        console.log(response.data.message);
        toast.success("Expense added successfully.");
        navigate("/users/groups", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to add expense.");
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Remaining: {totalSpend ?? 0}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    value={friends[currentIndex]?.name || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={friends[currentIndex]?.email || ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bill Amount"
                    variant="outlined"
                    fullWidth
                    value={friends[currentIndex]?.bill || ""}
                    onChange={handleFriendChange}
                    disabled={divideMethod === "equal"}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="medium"
                    sx={{ fontSize: "0.75rem", padding: "8px 16px" }}
                    onClick={handlePaid}
                    disabled={friends[currentIndex]?.userId === paidBy}
                  >
                    Paid By
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    size="medium"
                    sx={{ fontSize: "0.75rem", padding: "8px 16px" }}
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </Button>
                </Grid>
                {currentIndex < totalFriends - 1 ? (
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="medium"
                      sx={{ fontSize: "0.75rem", padding: "8px 16px" }}
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="medium"
                      sx={{ fontSize: "0.75rem", padding: "8px 16px" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default FriendInput;
