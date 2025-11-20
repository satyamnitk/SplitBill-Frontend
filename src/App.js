import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Users from "./components/Users";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import InputGroupField from "./components/InputGroupField";
import Groups from "./components/Groups";
import AddExpense from "./components/AddExpense";
import ViewExpenses from "./components/ViewExpenses";
import ViewMembers from "./components/ViewMembers";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/forgot-password" element={<ForgotPassword />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/users/dashboard" element={<Dashboard />} />
          <Route path="/users/create-group" element={<InputGroupField />} />
          <Route path="/users/groups" element={<Groups />} />
          <Route path="/users/groups/add-expense" element={<AddExpense />} />
          <Route
            path="/users/groups/view-expenses"
            element={<ViewExpenses />}
          />
          <Route path="/users/groups/view-members" element={<ViewMembers />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
