import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Pages.css";

function Page2() {
  const { testTitle } = useParams();  // Getting the testTitle from the URL params
  const { state } = useLocation();  // Getting the state (e.g., duration) passed from the previous page
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timer, setTimer] = useState(state?.duration || 0);
  const [answers, setAnswers] = useState([]);  // Store selected answers

  useEffect(() => {
    // Fetch questions from the API based on testTitle
    fetch(`http://localhost:9999/modakflix-test/api/get-test-questions/${testTitle}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);  // Assuming the API returns an array of questions
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [testTitle]);

  useEffect(() => {
    // Timer countdown
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      handleFinish();
    }
  }, [timer]);

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestionIndex]?.answer) {
      setScore(score + 1);
    }
    setAnswers([...answers, selectedAnswer]); // Save the answer
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleFinish = () => {
    if (selectedAnswer === questions[currentQuestionIndex]?.answer) {
      setScore(score + 1);
    }
    setAnswers([...answers, selectedAnswer]); // Save the last answer
    alert(`Test finished! Your score is ${score} / ${questions.length}`);
    // Call API to record the test result
    fetch("http://localhost:9999/modakflix-test/api/record-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "test_user", // Hardcoded username
        marks: score,
      }),
    }).then(() => navigate("/"));
  };

  if (!questions.length) {
    return <div>Loading questions for {testTitle}...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="test-page">
      <h1>{testTitle}</h1>
      <h2>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</h2>
      <h2>{currentQuestion.question}</h2>
      <div className="test-options">
        {["option1", "option2", "option3", "option4"].map((option, index) => (
          <button
            key={index}
            className={`test-option ${
              selectedAnswer === currentQuestion[option] ? "selected" : ""
            }`}
            onClick={() => setSelectedAnswer(currentQuestion[option])}
          >
            {currentQuestion[option]}
          </button>
        ))}
      </div>
      <div className="test-navigation">
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext} className="next-btn">
            Next
          </button>
        ) : (
          <button onClick={handleFinish} className="finish-btn">
            Finish
          </button>
        )}
      </div>
    </div>
  );
}

export default Page2;
