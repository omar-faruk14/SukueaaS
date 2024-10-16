"use client"; 
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import "./Login_css.css";

export default function Page() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/Admin/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tsukuerabo_Admin_Login_User_Name: userName,
          tsukuerabo_Admin_Password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        router.push("/Admin/Settings/Event_Line_Settings"); 
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="text-center mt-4 name">つくえらぼテスト用</div>
        <form className="p-3 mt-3" onSubmit={handleSubmit}>
          <div className="form-field d-flex align-items-center">
            <span className="far fa-user" />
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="form-field d-flex align-items-center">
            <span className="fas fa-key" />
            <input
              type="password"
              name="password"
              id="pwd"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="btn mt-3">Login</button>
        </form>
      </div>
    </div>
  );
}
