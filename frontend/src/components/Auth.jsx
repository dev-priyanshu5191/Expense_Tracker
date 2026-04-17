import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear old errors
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await API.post(endpoint, formData);
      
      // Data local storage mein save karein
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      
      // Dashboard pe bhejein
      navigate("/dashboard"); 
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="card animate-slide-up" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "var(--primary-color)" }}>
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>
        
        {errorMsg && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", fontSize: "0.9rem" }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Name</label>
              <input type="text" name="name" onChange={handleChange} required />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: "20px" }}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: "var(--primary-color)", cursor: "pointer", fontWeight: "600" }} onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}>
            {isLogin ? "Sign up here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;