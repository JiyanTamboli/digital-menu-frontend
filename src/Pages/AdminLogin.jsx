import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLogin.css";
// Create the AdminLogin component for admin authentication
export default function AdminLogin() {
  const navigate = useNavigate(); // Hook to handle navigation between routes

  // State variables to track email and password input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to update email state when user types in the email field
  const getEmail = (e) => {
    setEmail(e.target.value);
  };

  // Function to update password state when user types in the password field
  const getPassword = (e) => {
    setPassword(e.target.value);
  };

  // Handles login when user clicks the login button
  const login = () => {
    if (email === "admin@gmail.com" && password === "admin123") {
      alert("✅ Login Successful!");
      navigate("/admin"); // Redirect to the admin dashboard on successful login
    } else {
      alert("❌ Incorrect Email or Password"); // Show error alert for wrong credentials
    }
  };

  // Render the admin login form UI with styled background and box
  return (
    <div className="login-background">
      <div className="login-box">
        <h2>🔐 Admin Login</h2>
        {/* Email input field for admin */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={getEmail}
        />
        {/* Password input field for admin */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={getPassword}
        />
        {/* Login button to trigger login function */}
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
