import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MalPracticeDialogPage.css";
import Navbar from '../../components/Navbar/Navbar';

function MalPracticeDialogPage() {


  const navigate = useNavigate();
  const handleFinish = () => {
    navigate("/");
};

  return (
    <div className="malpratice-page">
      <Navbar />
      <h1 className="malpractice-h1">Malpractice detected.</h1>
      <h2>The test has been stopped due to malpractice and has been awarded 0. Contact your course teacher.</h2>
      <br />
      <button onClick={handleFinish} className="finish-btn">
        Finish
      </button>
    </div>
  );
}

export default MalPracticeDialogPage;
