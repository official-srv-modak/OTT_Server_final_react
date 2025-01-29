import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EndTestPage.css";
import Navbar from '../../components/Navbar/Navbar';

function EndTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, message } = location.state || { title: "Warning", message: "Something went wrong." };

  const handleFinish = () => {
    navigate("/");
  };

  return (
    <div className="malpratice-page">
      <Navbar />
      <h1 className="malpractice-h1">{title}</h1>
      <h2>{message}</h2>
      <br />
      <button onClick={handleFinish} className="finish-btn">
        Finish
      </button>
    </div>
  );
}

export default EndTestPage;
