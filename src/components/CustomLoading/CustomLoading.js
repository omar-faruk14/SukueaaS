// CustomLoading.js
"use client";
import React from "react";
import "./CustomLoading.css";

const CustomLoading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>読み込み中です。しばらくお待ちください...</p>
    </div>
  );
};

export default CustomLoading;
