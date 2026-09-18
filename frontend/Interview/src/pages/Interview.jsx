import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./interview.css";

const Interview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    type: "",
    difficulty: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const interviewTypes = {
    python: [
      { value: "technical", label: "Technical Interview" },
      { value: "dsa", label: "DSA & Problem Solving" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    java: [
      { value: "technical", label: "Technical Interview" },
      { value: "dsa", label: "DSA & Problem Solving" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    frontend: [
      { value: "technical", label: "Technical Interview" },
      { value: "dsa", label: "DSA & Problem Solving" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    backend: [
      { value: "technical", label: "Technical Interview" },
      { value: "dsa", label: "DSA & Problem Solving" },
      { value: "sql", label: "SQL & Database" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    fullstack: [
      { value: "technical", label: "Technical Interview" },
      { value: "dsa", label: "DSA & Problem Solving" },
      { value: "sql", label: "SQL & Database" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    "data-scientist": [
      { value: "technical", label: "Technical Interview" },
      { value: "ai-ml", label: "AI / ML Interview" },
      { value: "sql", label: "SQL & Database" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    "ml-engineer": [
      { value: "technical", label: "Technical Interview" },
      { value: "ai-ml", label: "AI / ML Interview" },
      { value: "dsa", label: "DSA & Problem Solving" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    mathematics: [
      { value: "conceptual", label: "Mathematics Concepts" },
      { value: "numerical", label: "Numerical & Problem Solving" },
      { value: "reasoning", label: "Mathematical Reasoning" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    physics: [
      { value: "conceptual", label: "Physics Concepts" },
      { value: "numerical", label: "Numerical & Problem Solving" },
      { value: "applied", label: "Applied Physics" },
      { value: "hr", label: "HR & Behavioral" },
    ],

    chemistry: [
      { value: "conceptual", label: "Chemistry Concepts" },
      { value: "numerical", label: "Numerical & Problem Solving" },
      { value: "applied", label: "Applied Chemistry" },
      { value: "hr", label: "HR & Behavioral" },
    ],
  };

  const currentInterviewTypes =
    interviewTypes[formData.role] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      if (name === "role") {
        updatedData.type = "";
      }

      return updatedData;
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.role ||
      !formData.experience ||
      !formData.type ||
      !formData.difficulty
    ) {
      setError("Please select all interview options.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/interview/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to generate interview questions."
        );
      }

      if (
        !data.questions ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      console.log("AI Questions:", data.questions);

      navigate("/interview/session", {
        state: {
          interviewData: formData,
          questions: data.questions,
        },
      });
    } catch (error) {
      console.error(
        "Interview generation error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-page">
      <div className="background-orb orb-one"></div>
      <div className="background-orb orb-two"></div>

      <header className="interview-navbar">
        <div className="interview-logo">
          Interview<span>IQ</span>
        </div>

        <div className="navbar-center">
          <span className="navbar-status">
            <span className="online-dot"></span>
            AI Interview Studio
          </span>
        </div>

        <div className="navbar-profile">
          <div className="profile-avatar">
            SJ
          </div>

          <div className="profile-info">
            <strong>Sujal Jain</strong>
            <span>Candidate</span>
          </div>

          <span className="profile-chevron">
            ⌄
          </span>
        </div>
      </header>

      <main className="interview-main">
        <section className="interview-heading">
          <div className="heading-badge">
            <span>✦</span>
            PERSONALIZED AI PRACTICE
          </div>

          <h1>
            Prepare smarter.
            <br />
            <span>Interview better.</span>
          </h1>

          <p>
            Create a focused practice session tailored
            to your role, experience, and career goals.
          </p>
        </section>

        <section className="interview-layout">
          <div className="interview-form-card">
            <div className="form-card-header">
              <div>
                <span className="section-label">
                  SESSION CONFIGURATION
                </span>

                <h2>Build your interview</h2>
              </div>

              <div className="step-indicator">
                <span>01</span>
                <div className="step-line"></div>
                <span className="step-muted">01</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* JOB ROLE */}

              <div className="input-field">
                <label htmlFor="role">
                  <span className="label-icon">
                    💼
                  </span>

                  Job Role / Subject

                  <span className="required">*</span>
                </label>

                <div className="custom-select">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select your target role or subject
                    </option>

                    <optgroup label="Technology">
                      <option value="python">
                        Python Developer
                      </option>

                      <option value="java">
                        Java Developer
                      </option>

                      <option value="frontend">
                        Frontend Developer
                      </option>

                      <option value="backend">
                        Backend Developer
                      </option>

                      <option value="fullstack">
                        Full Stack Developer
                      </option>

                      <option value="data-scientist">
                        Data Scientist
                      </option>

                      <option value="ml-engineer">
                        Machine Learning Engineer
                      </option>
                    </optgroup>

                    <optgroup label="Science & Mathematics">
                      <option value="mathematics">
                        Mathematics
                      </option>

                      <option value="physics">
                        Physics
                      </option>

                      <option value="chemistry">
                        Chemistry
                      </option>
                    </optgroup>
                  </select>

                  <span className="custom-arrow">
                    ⌄
                  </span>
                </div>
              </div>

              {/* EXPERIENCE */}

              <div className="input-field">
                <label htmlFor="experience">
                  <span className="label-icon">
                    📊
                  </span>

                  Experience Level

                  <span className="required">*</span>
                </label>

                <div className="custom-select">
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select your experience
                    </option>

                    <option value="fresher">
                      Fresher
                    </option>

                    <option value="junior">
                      0 - 2 Years
                    </option>

                    <option value="mid">
                      2 - 5 Years
                    </option>

                    <option value="senior">
                      5+ Years
                    </option>
                  </select>

                  <span className="custom-arrow">
                    ⌄
                  </span>
                </div>
              </div>

              {/* INTERVIEW TYPE */}

              <div className="input-field">
                <label htmlFor="type">
                  <span className="label-icon">
                    🧠
                  </span>

                  Interview Type

                  <span className="required">*</span>
                </label>

                <div className="custom-select">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={!formData.role}
                    required
                  >
                    <option value="">
                      {formData.role
                        ? "Choose interview category"
                        : "Select role or subject first"}
                    </option>

                    {currentInterviewTypes.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </option>
                      )
                    )}
                  </select>

                  <span className="custom-arrow">
                    ⌄
                  </span>
                </div>
              </div>

              {/* DIFFICULTY */}

              <div className="difficulty-section">
                <div className="difficulty-heading">
                  <label>
                    <span className="label-icon">
                      ◈
                    </span>

                    Difficulty Level

                    <span className="required">
                      *
                    </span>
                  </label>

                  <span className="difficulty-hint">
                    Choose your challenge
                  </span>
                </div>

                <div className="difficulty-grid">
                  <label
                    className={`difficulty-card easy-card ${
                      formData.difficulty ===
                      "easy"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value="easy"
                      checked={
                        formData.difficulty ===
                        "easy"
                      }
                      onChange={handleChange}
                      required
                    />

                    <span className="difficulty-symbol">
                      🌱
                    </span>

                    <span className="difficulty-content">
                      <strong>Easy</strong>
                      <small>Fundamentals</small>
                    </span>

                    <span className="radio-check">
                      ✓
                    </span>
                  </label>

                  <label
                    className={`difficulty-card medium-card ${
                      formData.difficulty ===
                      "medium"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value="medium"
                      checked={
                        formData.difficulty ===
                        "medium"
                      }
                      onChange={handleChange}
                    />

                    <span className="difficulty-symbol">
                      ⚡
                    </span>

                    <span className="difficulty-content">
                      <strong>Medium</strong>
                      <small>Intermediate</small>
                    </span>

                    <span className="radio-check">
                      ✓
                    </span>
                  </label>

                  <label
                    className={`difficulty-card hard-card ${
                      formData.difficulty ===
                      "hard"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value="hard"
                      checked={
                        formData.difficulty ===
                        "hard"
                      }
                      onChange={handleChange}
                    />

                    <span className="difficulty-symbol">
                      🔥
                    </span>

                    <span className="difficulty-content">
                      <strong>Hard</strong>
                      <small>Advanced</small>
                    </span>

                    <span className="radio-check">
                      ✓
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    background: "#fff1f2",
                    color: "#be123c",
                    fontSize: "14px",
                    border:
                      "1px solid #fecdd3",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                className="start-button"
                type="submit"
                disabled={loading}
              >
                <span className="start-button-icon">
                  {loading ? "◌" : "✦"}
                </span>

                <span>
                  {loading
                    ? "Generating AI Questions..."
                    : "Start AI Interview"}
                </span>

                <span className="start-button-arrow">
                  {loading ? "" : "→"}
                </span>
              </button>

              <p className="form-bottom-note">
                <span>🔒</span>
                Your preferences are private and secure.
              </p>
            </form>
          </div>

          {/* RIGHT PREVIEW */}

          <aside className="interview-preview">
            <div className="preview-top">
              <div className="preview-icon">
                <span>✦</span>
              </div>

              <span className="preview-live">
                <span></span>
                READY TO START
              </span>
            </div>

            <h3>
              Your AI interview
              <br />
              <span>starts here.</span>
            </h3>

            <p className="preview-description">
              Your session will adapt to your selected
              role or subject and provide meaningful
              feedback after every response.
            </p>

            <div className="preview-divider"></div>

            <div className="preview-features">
              <div className="preview-feature">
                <div className="preview-feature-icon purple-icon">
                  ✦
                </div>

                <div>
                  <strong>
                    Personalized Questions
                  </strong>

                  <span>
                    Relevant to your selected role
                    or subject
                  </span>
                </div>
              </div>

              <div className="preview-feature">
                <div className="preview-feature-icon blue-icon">
                  ◉
                </div>

                <div>
                  <strong>
                    Real-time Evaluation
                  </strong>

                  <span>
                    Get feedback as you practice
                  </span>
                </div>
              </div>

              <div className="preview-feature">
                <div className="preview-feature-icon green-icon">
                  ↗
                </div>

                <div>
                  <strong>
                    Actionable Insights
                  </strong>

                  <span>
                    Know exactly what to improve
                  </span>
                </div>
              </div>
            </div>

            <div className="preview-footer">
              <div className="preview-footer-icon">
                ⏱
              </div>

              <div>
                <strong>
                  15–20 minutes
                </strong>

                <span>
                  Average session duration
                </span>
              </div>
            </div>

            <div className="preview-decoration decoration-one"></div>
            <div className="preview-decoration decoration-two"></div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Interview;