import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../Assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!data.email || !data.password) {
      setError("All fields required");
      return false;
    }
    if (currState === "Sign Up" && !data.name) {
      setError("Enter your name.");
      return false;
    }
    return true;
  };

  const onLogin = async (event) => {
    event.preventDefault();

    setError(""); 
    
    if (!validateForm()) return;

    setLoading(true);
   

    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Incorrect email or password.");
      console.error(err);
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Fechar"
          />
        </div>

        {error && (
          <div className="login-popup-error" aria-live="assertive">
            {error}
          </div>
        )}

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Wait..." : currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
          By continuing, I agree to the terms of use and privacy policy.
          </p>
        </div>

        {currState === "Login" ? (
          <p>
            Don't have an account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Create here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
