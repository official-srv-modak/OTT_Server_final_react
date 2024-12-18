import React, { useState, useEffect } from 'react';
import './Login.css';
import logo from '../../assets/BSLogo_transparent.png';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUrl = import.meta.env.VITE_SPRING_LOGIN_URL;
  const authUrl = import.meta.env.VITE_SPRING_AUTH_URL;
  const signupUrl = import.meta.env.VITE_SPRING_SIGNUP_URL;
  const apiResetUrl = import.meta.env.VITE_RESET_DISK__URL;
  const resetInterval = import.meta.env.VITE_RESET_FILESYSTEM;
  const apiKey = import.meta.env.VITE_API_KEY;

  // Function to call the external API every 30 seconds when idle
  const callReloadDiskAPI = async () => {
    try {
      const response = await fetch(`${apiResetUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Disk reload API called successfully');
    } catch (error) {
      console.error('Error calling reload disk API:', error);
    }
  };

  useEffect(() => {
    // Set up interval to call the API every 30 seconds
    callReloadDiskAPI();
    const idleInterval = setInterval(() => {
      callReloadDiskAPI();
    }, resetInterval); // Call every 30 seconds

    return () => clearInterval(idleInterval); // Cleanup on component unmount
  }, []);

  const handleSignup = async () => {
    try {
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: apiKey },
        body: JSON.stringify({
          user: {
            username,
            password,
            firstName,
            lastName,
            role: "USER"
          }
        })
      });
      const data = await response.json();
      if (data.status === "ACCEPTED") {
        alert(data.message);
        setSignState("Sign In");
      } else {
        alert("Signup failed.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(loginUrl, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      console.log('Response from login:', response.data);
      if (response.data.status === "OK") {
        localStorage.setItem("authToken", response.data.token);
        await authenticate();
      } else {
        alert(`Login failed: ${response.data.message || "Invalid credentials"}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    }
  };


  const authenticate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:8081/modakflix-auth/user/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: apiKey },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (data.status === "OK") {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/general'); // Redirect to the home page on successful authentication
      } else {
        alert("Authentication failed.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signState === "Sign Up") {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  return (
    <div className='login'>
      <img src={logo} className='login-logo' alt="" />
      <div className="login-form">
        <h1>{signState}</h1>
        <form onSubmit={handleSubmit}>
          {signState === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}
          {/* Dropdowns */}
          <select className="login-dropdown">
            <option value="" disabled selected>Select Directorate</option>
            <option value="Directorate1">Directorate 1</option>
            <option value="Directorate2">Directorate 2</option>
            <option value="Directorate3">Directorate 3</option>
          </select>
          <select className="login-dropdown">
            <option value="" disabled selected>Select Unit</option>
            <option value="Unit1">Unit 1</option>
            <option value="Unit2">Unit 2</option>
            <option value="Unit3">Unit 3</option>
          </select>
          <select className="login-dropdown">
            <option value="" disabled selected>Select School</option>
            <option value="School1">School 1</option>
            <option value="School2">School 2</option>
            <option value="School3">School 3</option>
          </select>
          <select className="login-dropdown">
            <option value="" disabled selected>Select Region</option>
            <option value="Region1">Region 1</option>
            <option value="Region2">Region 2</option>
            <option value="Region3">Region 3</option>
          </select>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{signState}</button>
        </form>
        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>New to BootStream? <span onClick={() => setSignState("Sign Up")}>Sign up now</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setSignState("Sign In")}>Sign In now</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
