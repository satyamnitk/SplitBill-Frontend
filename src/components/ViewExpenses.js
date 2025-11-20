import {
  Button,
  Card,
  CardContent,
  Container,
  createTheme,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "./Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const theme = createTheme({
  typography: {
    fontFamily: '"Comfortaa", sans-serif',
  },
});

const ViewExpenses = () => {
  const location = useLocation();
  const { groupId, groupName, userId, userName } = location.state || {};
  const [expenseDetails, setExpenseDetails] = useState([]);
  const [userTotals, setUserTotals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);

  useEffect(() => {
    if (!groupId || !groupName || !userId || !userName) {
      toast.error("Group ID or User ID is not found.");
      return;
    }

    const fetchExpenseDetails = async () => {
      setLoading(true);

      try {
        const response = await axios.post(`${apiUrl}/groups/view-expense`, {
          groupId,
        });

        if (response.status === 200) {
          const temp = response.data.expenses;
          setExpenseDetails(temp);
          const result = {};

          temp.forEach((expense) => {
            expense.splits.forEach((split) => {
              // If the user is the one who paid
              if (expense.paidBy._id === userId) {
                if (split.userId !== userId) {
                  // Add the bill to the user who owes
                  if (result[split.userId]) {
                    result[split.userId].bill += split.bill;
                  } else {
                    result[split.userId] = {
                      name: split.name,
                      email: split.email,
                      bill: split.bill,
                    };
                  }
                }
              } else {
                // If the user is the one who owes
                if (split.userId === userId) {
                  // Subtract the bill from the user who paid
                  if (result[expense.paidBy._id]) {
                    result[expense.paidBy._id].bill -= split.bill;
                  } else {
                    // Initialize the entry if not already present
                    result[expense.paidBy._id] = {
                      name: expense.paidBy.name,
                      email: expense.paidBy.email,
                      bill: -split.bill, // Negative because they paid the bill
                    };
                  }
                }
              }
            });
          });

          setUserTotals(Object.values(result));
          console.log(response.data.message);
          toast.success("Expenses found successfully.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to find expenses.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!groupId || !groupName || !userId || !userName) {
    toast.error("Group ID or User ID is not found.");
    return;
  }

  const handleNotify = async () => {
    if (userTotals.length === 0) {
      toast.error("No members found.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/groups/notify-friends`, {
        userName,
        userTotals,
      });

      if (response.status === 200) {
        console.log(response.data.message);
        toast.success("Emails sent successfully.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to send emails.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpenseDetails = () => {
    setShowExpenseDetails(!showExpenseDetails);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        {loading ? (
          <Loader />
        ) : (
          <>
            <Typography variant="h4" gutterBottom align="center">
              {groupName}
            </Typography>

            {userTotals.length > 0 ? (
              <Grid container spacing={3}>
                {userTotals.map((user, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 2,
                            color:
                              user.bill < 0
                                ? "red"
                                : user.bill === 0
                                ? "gray"
                                : "black",
                          }}
                        >
                          Total Bill:{" "}
                          {user.bill === 0
                            ? "Settled"
                            : `₹${Math.abs(user.bill)}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" align="center" color="textSecondary">
                No user data available.
              </Typography>
            )}

            <Grid my={3} container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  size="small"
                  style={{
                    fontSize: "0.8rem",
                    padding: "8px 16px",
                  }}
                  onClick={handleNotify}
                >
                  Notify Members
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small" 
                  style={{
                    fontSize: "0.8rem",
                    padding: "8px 16px",
                  }}
                  onClick={toggleExpenseDetails}
                >
                  {showExpenseDetails
                    ? "Hide Expense Details"
                    : "Show Expense Details"}
                </Button>
              </Grid>
            </Grid>

            {showExpenseDetails && (
              <>
                <Typography
                  variant="h4"
                  gutterBottom
                  align="center"
                  sx={{ mt: 3 }}
                >
                  Expense Details
                </Typography>

                {expenseDetails.length > 0 ? (
                  <Grid container spacing={3}>
                    {expenseDetails.map((expense) => (
                      <Grid item xs={12} sm={6} md={4} key={expense._id}>
                        <Card elevation={3}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Paid By: {expense.paidBy.name}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontSize: "1rem" }}
                            >
                              Total: ₹{expense.total}
                            </Typography>
                            {expense.splits.map((split, index) => (
                              <Typography
                                key={index}
                                variant="body2"
                                color="textSecondary"
                              >
                                {split.name}: ₹{split.bill}
                              </Typography>
                            ))}
                            <Typography
                              variant="body1"
                              sx={{ mt: 2, fontSize: "0.8rem" }}
                            >
                              Timestamp: {expense.createdAt}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    variant="body1"
                    align="center"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                  >
                    No expense details available.
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ViewExpenses;
