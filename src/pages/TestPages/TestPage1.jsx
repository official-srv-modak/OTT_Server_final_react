import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Pages.css";
import Navbar from '../../components/Navbar/Navbar';

function Page1() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();
  const getTestUrl = import.meta.env.VITE_GET_TESTS;

  useEffect(() => {
    // Fetch test files and their metadata from the backend
    const fetchTests = async () => {
      try {
        const response = await fetch(getTestUrl);
        const data = await response.json();

        // Ensure the API response contains the required fields
        if (Array.isArray(data) && data.every((test) => test.title && test.duration)) {
          setTests(data);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchTests();
  }, []);

  const startTest = (test) => {
    navigate(`/test/${encodeURIComponent(test.title)}`, { state: { duration: test.duration } });
  };

  if (!tests.length) {
    return <div>Loading available tests...</div>;
  }

  return (
    <div className="test-page">
      <Navbar />
      <h1>Available Tests</h1>
      <ul className="test-list">
        {tests.map((test, index) => (
          <li key={index} className="test-item">
            <button className="next-btn" onClick={() => startTest(test)}>
              {test.title} - {test.duration / 60} minutes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page1;
