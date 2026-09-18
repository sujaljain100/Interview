import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./inter.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const interviewData = location.state?.interviewData;
  const questions = location.state?.questions || [];

  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");


  // ==========================================
  // SESSION VALIDATION
  // ==========================================

  if (
    !interviewData ||
    questions.length === 0
  ) {
    return (
      <div className="session-error">

        <div className="error-card">

          <h2>
            No Interview Session Found
          </h2>

          <p>
            Please create an interview session first.
          </p>

          <button
            onClick={() =>
              navigate("/interview")
            }
          >
            Go to Interview Setup
          </button>

        </div>

      </div>
    );
  }


  const currentQuestion =
    questions[questionNumber - 1];


  // ==========================================
  // EVALUATE CURRENT ANSWER
  // ==========================================

  const evaluateCurrentAnswer = async () => {

    const response = await fetch(
      `${API_URL}/api/interview/evaluate`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          role: interviewData.role,
          experience: interviewData.experience,
          interview_type: interviewData.type,
          difficulty: interviewData.difficulty,
          question: currentQuestion,
          answer: answer.trim(),
        }),
      }
    );


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.detail ||
        "Unable to evaluate answer."
      );

    }


    return data.evaluation;
  };


  // ==========================================
  // NEXT QUESTION
  // ==========================================

  const handleNextQuestion = async () => {

    if (!answer.trim()) {

      alert(
        "Please write your answer before continuing."
      );

      return;
    }


    setEvaluating(true);
    setError("");


    try {

      const evaluation =
        await evaluateCurrentAnswer();


      const updatedAnswers = [
        ...answers,
      ];

      updatedAnswers[
        questionNumber - 1
      ] = answer;


      const updatedEvaluations = [
        ...evaluations,
      ];

      updatedEvaluations[
        questionNumber - 1
      ] = evaluation;


      setAnswers(updatedAnswers);

      setEvaluations(
        updatedEvaluations
      );


      // --------------------------------------
      // More questions
      // --------------------------------------

      if (
        questionNumber <
        questions.length
      ) {

        setQuestionNumber(
          questionNumber + 1
        );

        setAnswer("");

      }

      // --------------------------------------
      // Interview completed
      // --------------------------------------

      else {

        navigate("/results", {
          state: {
            interviewData,
            questions,
            answers: updatedAnswers,
            evaluations:
              updatedEvaluations,
          },
        });

      }

    } catch (error) {

      console.error(
        "Evaluation error:",
        error
      );

      setError(
        error.message ||
        "Unable to evaluate your answer."
      );

    } finally {

      setEvaluating(false);

    }
  };


  // ==========================================
  // PREVIOUS QUESTION
  // ==========================================

  const handlePreviousQuestion = () => {

    if (questionNumber <= 1) {
      return;
    }


    const previousAnswer =
      answers[questionNumber - 2] || "";


    setQuestionNumber(
      questionNumber - 1
    );

    setAnswer(
      previousAnswer
    );

    setError("");
  };


  // ==========================================
  // FINISH INTERVIEW
  // ==========================================

  const handleFinishInterview = async () => {

    if (!answer.trim()) {

      alert(
        "Please answer the current question first."
      );

      return;
    }


    setEvaluating(true);
    setError("");


    try {

      const evaluation =
        await evaluateCurrentAnswer();


      const updatedAnswers = [
        ...answers,
      ];

      updatedAnswers[
        questionNumber - 1
      ] = answer;


      const updatedEvaluations = [
        ...evaluations,
      ];

      updatedEvaluations[
        questionNumber - 1
      ] = evaluation;


      navigate("/results", {
        state: {
          interviewData,
          questions,
          answers: updatedAnswers,
          evaluations:
            updatedEvaluations,
        },
      });

    } catch (error) {

      console.error(
        "Evaluation error:",
        error
      );

      setError(
        error.message ||
        "Unable to finish the interview."
      );

    } finally {

      setEvaluating(false);

    }
  };


  return (
    <div className="session-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="session-header">

        <div className="session-logo">

          Interview
          <span>IQ</span>

        </div>


        <div className="session-info">

          <span>
            {interviewData.role}
          </span>

          <span>
            {interviewData.difficulty}
          </span>

        </div>

      </header>



      {/* =====================================
          MAIN
      ====================================== */}

      <main className="session-container">


        {/* TOP */}

        <div className="interview-top">

          <div>

            <p className="session-label">
              AI MOCK INTERVIEW
            </p>

            <h1>
              {interviewData.role} Interview
            </h1>

            <p className="session-subtitle">
              Answer the question naturally and clearly.
            </p>

          </div>


          <div className="question-counter">

            <span>
              QUESTION
            </span>

            <strong>
              {questionNumber}/{questions.length}
            </strong>

          </div>

        </div>



        {/* DETAILS */}

        <div className="details-container">

          <div className="detail-box">

            <span>
              Role
            </span>

            <strong>
              {interviewData.role}
            </strong>

          </div>


          <div className="detail-box">

            <span>
              Experience
            </span>

            <strong>
              {interviewData.experience}
            </strong>

          </div>


          <div className="detail-box">

            <span>
              Interview Type
            </span>

            <strong>
              {interviewData.type}
            </strong>

          </div>


          <div className="detail-box">

            <span>
              Difficulty
            </span>

            <strong>
              {interviewData.difficulty}
            </strong>

          </div>

        </div>



        {/* =====================================
            QUESTION CARD
        ====================================== */}

        <section className="question-card">

          <div className="question-header">

            <div className="ai-icon">
              AI
            </div>


            <div>

              <span>
                INTERVIEWER
              </span>

              <h3>
                AI Interviewer
              </h3>

            </div>

          </div>


          <div className="question-content">

            <p className="question-number">
              Question {questionNumber}
            </p>

            <h2>
              {currentQuestion}
            </h2>

          </div>

        </section>



        {/* =====================================
            ANSWER
        ====================================== */}

        <section className="answer-section">

          <div className="answer-header">

            <h3>
              Your Answer
            </h3>

            <span>
              {answer.length} characters
            </span>

          </div>


          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Type your answer here..."
            disabled={evaluating}
          />


          <div className="answer-footer">

            <p>
              💡 Tip: Give a clear and structured answer.
            </p>

            <span>
              {evaluating
                ? "AI is evaluating..."
                : answer.trim()
                ? "Ready to submit"
                : "Waiting for your answer"}
            </span>

          </div>

        </section>



        {/* ERROR */}

        {error && (

          <div className="session-error-message">
            {error}
          </div>

        )}



        {/* =====================================
            ACTIONS
        ====================================== */}

        <div className="session-actions">


          <button
            className="finish-btn"
            onClick={handleFinishInterview}
            disabled={evaluating}
          >

            {evaluating
              ? "Evaluating..."
              : "Finish Interview"}

          </button>


          <div className="session-navigation">


            <button
              className="finish-btn"
              onClick={
                handlePreviousQuestion
              }
              disabled={
                questionNumber === 1 ||
                evaluating
              }
            >

              ← Previous

            </button>


            <button
              className="next-btn"
              onClick={
                handleNextQuestion
              }
              disabled={evaluating}
            >

              {evaluating
                ? "AI Evaluating..."
                : questionNumber ===
                  questions.length
                ? "Finish Interview"
                : "Next Question"}

              {!evaluating && (
                <span>
                  →
                </span>
              )}

            </button>

          </div>

        </div>


      </main>

    </div>
  );
};

export default InterviewSession;