import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, setUser } from "./redux/authSlice";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = ({ onBack }) => {
  const dispatch = useDispatch();
  const { error, loading, message } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loginData, setLoginData] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === "fulfilled") {
      setLoginData(result.payload);
    }
  };

  const handleContinue = () => {
    dispatch(setUser(loginData));
    dispatch(clearError());
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="header">Login To Ecom </h2>
        <h4 className="heading">
          Grow Your Business with Us By Logging into your Seller Account
        </h4>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          {loading ? "Logging in..." : "Login"}
        </button>

        <button type="button" className="back-btn" onClick={onBack}>
          Go to Signup
        </button>
      </form>

      {loginData && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{message || "Login Successful"}</h3>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </div>
      )}

      {error && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>{error}</h3>
            <button onClick={() => dispatch(clearError())}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
