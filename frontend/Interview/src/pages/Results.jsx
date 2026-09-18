import { useLocation, useNavigate } from "react-router-dom";
import "./res.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const interviewData =
    location.state?.interviewData;

  const questions =
    location.state?.questions || [];

  const answers =
    location.state?.answers || [];

  const evaluations =
    location.state?.evaluations || [];


  // ==========================================
  // SESSION CHECK
  // ==========================================

  if (
    !interviewData ||
    evaluations.length === 0
  ) {
    return (
      <div className="results-error">

        <div className="results-error-card">

          <h2>
            No Interview Results Found
          </h2>

          <p>
            Complete an interview to see your results.
          </p>

          <button
            onClick={() =>
              navigate("/interview")
            }
          >
            Start Interview
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // SCORE CALCULATION
  // ==========================================

  const validEvaluations =
    evaluations.filter(Boolean);


  const totalScore =
    validEvaluations.reduce(
      (total, evaluation) =>
        total +
        Number(evaluation.score || 0),
      0
    );


  const averageScore =
    validEvaluations.length > 0
      ? (
          (totalScore /
            validEvaluations.length) *
          10
        ).toFixed(0)
      : 0;


  const averageScore10 =
    validEvaluations.length > 0
      ? (
          totalScore /
          validEvaluations.length
        ).toFixed(1)
      : "0.0";


  const totalQuestions =
    questions.length;


  const answeredQuestions =
    answers.filter(
      (answer) =>
        answer &&
        answer.trim()
    ).length;


  // ==========================================
  // OVERALL FEEDBACK
  // ==========================================

  const allStrengths =
    validEvaluations.flatMap(
      (evaluation) =>
        evaluation.strengths || []
    );


  const allWeaknesses =
    validEvaluations.flatMap(
      (evaluation) =>
        evaluation.weaknesses || []
    );


  return (
    <div className="results-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <header className="results-header">

        <div className="results-logo">
          Interview<span>IQ</span>
        </div>

        <button
          className="new-interview-btn"
          onClick={() =>
            navigate("/interview")
          }
        >
          + New Interview
        </button>

      </header>



      {/* =====================================
          MAIN
      ====================================== */}

      <main className="results-container">


        {/* TITLE */}

        <section className="results-title">

          <p className="results-label">
            INTERVIEW COMPLETED
          </p>

          <h1>
            Your Interview Results
          </h1>

          <p>
            Here's how you performed in your
            {` ${interviewData.role}`} interview.
          </p>

        </section>



        {/* =====================================
            SCORE OVERVIEW
        ====================================== */}

        <section className="score-overview">


          <div className="score-card main-score">

            <span className="score-card-label">
              OVERALL SCORE
            </span>

            <div className="big-score">
              {averageScore}
              <small>%</small>
            </div>

            <div className="score-rating">
              {averageScore10} / 10
            </div>

            <p>
              Based on {answeredQuestions} of{" "}
              {totalQuestions} answered questions
            </p>

          </div>


          <div className="score-card">

            <span className="score-card-label">
              QUESTIONS
            </span>

            <strong className="small-score">
              {answeredQuestions}
            </strong>

            <p>
              Completed
            </p>

          </div>


          <div className="score-card">

            <span className="score-card-label">
              DIFFICULTY
            </span>

            <strong className="small-score difficulty-result">
              {interviewData.difficulty}
            </strong>

            <p>
              Selected level
            </p>

          </div>


          <div className="score-card">

            <span className="score-card-label">
              INTERVIEW TYPE
            </span>

            <strong className="type-result">
              {interviewData.type}
            </strong>

            <p>
              Interview category
            </p>

          </div>

        </section>



        {/* =====================================
            STRENGTHS / WEAKNESSES
        ====================================== */}

        <section className="feedback-grid">


          <div className="feedback-card">

            <div className="feedback-card-header">

              <div className="feedback-icon strength-icon">
                ✓
              </div>

              <div>

                <h2>
                  Your Strengths
                </h2>

                <span>
                  Areas where you performed well
                </span>

              </div>

            </div>


            <ul>

              {allStrengths
                .slice(0, 6)
                .map(
                  (strength, index) => (
                    <li key={index}>
                      {strength}
                    </li>
                  )
                )}

            </ul>

          </div>



          <div className="feedback-card">

            <div className="feedback-card-header">

              <div className="feedback-icon weakness-icon">
                !
              </div>

              <div>

                <h2>
                  Areas to Improve
                </h2>

                <span>
                  Focus on these areas
                </span>

              </div>

            </div>


            <ul>

              {allWeaknesses
                .slice(0, 6)
                .map(
                  (weakness, index) => (
                    <li key={index}>
                      {weakness}
                    </li>
                  )
                )}

            </ul>

          </div>

        </section>



        {/* =====================================
            QUESTION-BY-QUESTION RESULTS
        ====================================== */}

        <section className="questions-results">

          <div className="section-heading">

            <div>

              <p>
                DETAILED BREAKDOWN
              </p>

              <h2>
                Question Performance
              </h2>

            </div>

          </div>


          <div className="question-results-list">

            {questions.map(
              (question, index) => {

                const evaluation =
                  evaluations[index];

                const answer =
                  answers[index];


                if (!evaluation) {
                  return null;
                }


                const score =
                  Number(
                    evaluation.score || 0
                  );


                return (
                  <div
                    className="question-result-card"
                    key={index}
                  >


                    <div className="question-result-top">

                      <div>

                        <span className="result-question-number">
                          QUESTION {index + 1}
                        </span>

                        <h3>
                          {question}
                        </h3>

                      </div>


                      <div
                        className={`result-score ${
                          score >= 8
                            ? "score-good"
                            : score >= 5
                            ? "score-average"
                            : "score-low"
                        }`}
                      >
                        {score}/10
                      </div>

                    </div>


                    <div className="candidate-answer">

                      <span>
                        YOUR ANSWER
                      </span>

                      <p>
                        {answer}
                      </p>

                    </div>


                    <div className="evaluation-content">


                      <div className="evaluation-box">

                        <strong>
                          AI Feedback
                        </strong>

                        <p>
                          {evaluation.feedback}
                        </p>

                      </div>


                      <div className="evaluation-box">

                        <strong>
                          How to Improve
                        </strong>

                        <p>
                          {evaluation.improvement}
                        </p>

                      </div>


                      <div className="evaluation-box ideal-answer">

                        <strong>
                          Strong Answer Example
                        </strong>

                        <p>
                          {evaluation.ideal_answer}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>



        {/* =====================================
            FINAL ACTION
        ====================================== */}

        <div className="results-action">

          <button
            onClick={() =>
              navigate("/interview")
            }
          >
            Practice Again
            <span>
              →
            </span>
          </button>

        </div>

      </main>

    </div>
  );
};

export default Results;