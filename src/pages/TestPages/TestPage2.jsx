import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Pages.css";
import Navbar from '../../components/Navbar/Navbar';
import Dialog from '../../components/MessageComponent/Dialog';

function Page2() {
    const { testTitle } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timer, setTimer] = useState(state?.duration || 0);
    const [answers, setAnswers] = useState({});
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const malpracticeLog = [];

    const [dialog, setDialog] = useState(null);
    const [confirmFinish, setConfirmFinish] = useState(false);

    const [secretCodePrompt, setSecretCodePrompt] = useState(true);
    const [secretCode, setSecretCode] = useState("");

    const showDialog = (message, buttonText = "OK", onConfirm = null) => {
        setDialog({ message, buttonText, onConfirm });
    };

    const handleCloseDialog = () => {
        setDialog(null);
    };

    const handleSecretCodeSubmit = () => {
        const url = `http://localhost:9999/modakflix-test/api/get-test-questions-access-code/${testTitle}?secretCode=${secretCode}`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Invalid secret code.");
                }
                return response.json();
            })
            .then((data) => {
                setQuestions(data);
                setSecretCodePrompt(false);
            })
            .catch((error) => {
                showDialog("Invalid secret code. Please try again.", "Retry", () => {
                    setSecretCode("");
                    setSecretCodePrompt(true);
                    handleCloseDialog();
                });
            });
    };

    useEffect(() => {
        if (!secretCodePrompt) {
            localStorage.setItem("answers", null);
        }
    }, [secretCodePrompt]);

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", handleBackButton);
        return () => window.removeEventListener("popstate", handleBackButton);
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(intervalId);
        } else if (timer === 0) {
            submitTest();
        }
    }, [timer]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                const visitedUrl = document.referrer || "Unknown URL";
                malpracticeLog.push({ event: "Tab switch", url: visitedUrl, timestamp: new Date().toISOString() });
            }
        };

        const handleWindowBlur = () => {
            malpracticeLog.push({ event: "Left browser window", url: "Desktop environment", timestamp: new Date().toISOString() });
            setTabSwitchCount(prev => prev + 1);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleWindowBlur);

        return () => window.removeEventListener("blur", handleWindowBlur);
    }, []);

    useEffect(() => {
        if (tabSwitchCount === 1) {
            showDialog("Warning: Do not switch tabs or windows during the exam.", "Sorry");
        } else if (tabSwitchCount > 1) {
            fetch(import.meta.env.VITE_RECORD_TEST, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "test_user", marks: 0 }),
            }).then(() => navigate("/end-test", {
                state: {
                    title: "Malpractice Detected",
                    message: "Exam stopped due to malpractices. You have been awarded 0."
                }
            }));
        }
    }, [tabSwitchCount]);

    const handleAnswerSelection = (answer) => {
        setSelectedAnswer(answer);
        const updatedAnswers = { ...answers, [currentQuestionIndex]: answer };
        setAnswers(updatedAnswers);
        localStorage.setItem('answers', JSON.stringify(updatedAnswers));
    };

    const handleNext = () => {
        if (selectedAnswer === questions[currentQuestionIndex]?.answer) {
            setScore(score + 1);
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrevious = () => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setSelectedAnswer(answers[currentQuestionIndex - 1] || null);
    };

    const handleFinish = () => {
        setConfirmFinish(true);
        showDialog("Are you sure you want to finish the test?", "Yes, Submit", submitTest);
    };

    const submitTest = () => {
        setConfirmFinish(false);
        if (selectedAnswer === questions[currentQuestionIndex]?.answer) {
            setScore(score + 1);
        }

        fetch(import.meta.env.VITE_RECORD_TEST, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "test_user", marks: score }),
        }).then(() => navigate("/end-test", {
            state: {
                title: "Test Finished",
                message: `Test finished! Your score is ${score} / ${questions.length}`
            }
        }));
    };

    useEffect(() => {
        const savedAnswers = JSON.parse(localStorage.getItem('answers'));
        if (savedAnswers) setAnswers(savedAnswers);
    }, []);

    useEffect(() => {
        setSelectedAnswer(answers[currentQuestionIndex] || null);
    }, [currentQuestionIndex, answers]);

    if (secretCodePrompt) {
        return (
            <div className="test-page">
                <Navbar flag={1} />
                <div className="secret-code-dialog">
                    <h2>Enter Secret Access Code</h2>
                    <input
                        type="text"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        placeholder="Enter access code"
                        style={{ padding: "10px", fontSize: "1rem" }}
                    />
                    <br /><br />
                    <button onClick={handleSecretCodeSubmit} className="finish-btn">Submit Code</button>                    <br /><br />
                    <br /><br />
                    <button onClick={() => navigate('/page1')} className="finish-btn">Go back</button>
                    </div>
                {dialog && (
                    <Dialog
                        message={dialog.message}
                        buttonText={dialog.buttonText}
                        onClose={dialog.onConfirm ? () => {
                            dialog.onConfirm();
                            handleCloseDialog();
                        } : handleCloseDialog}
                    />
                )}
            </div>
        );
    }

    if (!questions.length) return <div>Loading questions for {testTitle}...</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="test-page">
            <Navbar flag={1} />
            <h2>Time Remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</h2>
            <h1>{testTitle}</h1>
            <h2>{currentQuestion.question}</h2>
            <div className="test-options">
                {["option1", "option2", "option3", "option4"].map((option, index) => (
                    <button
                        key={index}
                        className={`test-option ${selectedAnswer === currentQuestion[option] ? "selected" : ""}`}
                        onClick={() => handleAnswerSelection(currentQuestion[option])}
                    >
                        {currentQuestion[option]}
                    </button>
                ))}
            </div>
            <div className="test-navigation">
                {currentQuestionIndex > 0 && (
                    <button onClick={handlePrevious} className="next-btn">Previous</button>
                )}
                {currentQuestionIndex < questions.length - 1 && (
                    <button onClick={handleNext} className="next-btn">Next</button>
                )}
                <button onClick={handleFinish} className="finish-btn">Finish</button>
            </div>
            {dialog && (
                <Dialog
                    message={dialog.message}
                    buttonText={dialog.buttonText}
                    onClose={dialog.onConfirm ? () => {
                        dialog.onConfirm();
                        handleCloseDialog();
                    } : handleCloseDialog}
                />
            )}
        </div>
    );
}

export default Page2;
