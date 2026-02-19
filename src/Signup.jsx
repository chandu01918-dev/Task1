import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearError } from "./redux/authSlice";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Signup = ({ onBack }) => {
  const dispatch = useDispatch();
  const { error, loading, signupSuccess } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    dispatch(signupUser(form));
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="input-group">
          <FaUser className="icon" />
          <input name="firstname" placeholder="First Name" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaUser className="icon" />
          <input name="lastname" placeholder="Last Name" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaUser className="icon" />
          <input name="username" placeholder="Username" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaLock className="icon" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        </div>

        <button type="submit">
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <button type="button" className="back-btn" onClick={onBack}>
          Back to Login
        </button>
      </form>

      {signupSuccess && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Signup Successful</h3>
            <button onClick={onBack}>Go to Login</button>
          </div>
        </div>
      )}

      {error && (
        <div className="popup-overlay">
          <div className="popup">
            <h3 className="popup-error">{error}</h3>
            <button onClick={() => dispatch(clearError())}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
