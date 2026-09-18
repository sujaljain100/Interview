import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>
            Welcome back
            {user?.name ? `, ${user.name}` : ""} 👋
          </h1>

          <p>
            Track your interview preparation and
            improve your skills.
          </p>

          {user?.email && (
            <p
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              {user.email}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/interview"
            className="primary-btn"
          >
            + Start Interview
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#334155",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

      </div>


      {/* Statistics */}

      <div className="stats-container">

        <div className="stat-card">
          <p>Total Interviews</p>
          <h2>12</h2>
        </div>

        <div className="stat-card">
          <p>Average Score</p>
          <h2>78%</h2>
        </div>

        <div className="stat-card">
          <p>Best Score</p>
          <h2>92%</h2>
        </div>

        <div className="stat-card">
          <p>Questions Answered</p>
          <h2>86</h2>
        </div>

      </div>


      {/* Performance */}

      <div className="dashboard-section">

        <h2>Your Performance</h2>

        <div className="performance-container">

          <div className="performance-item">

            <div>
              <span>Technical Knowledge</span>
              <strong>82%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: "82%",
                }}
              ></div>
            </div>

          </div>


          <div className="performance-item">

            <div>
              <span>Problem Solving</span>
              <strong>76%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: "76%",
                }}
              ></div>
            </div>

          </div>


          <div className="performance-item">

            <div>
              <span>Communication</span>
              <strong>71%</strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: "71%",
                }}
              ></div>
            </div>

          </div>

        </div>

      </div>


      {/* Recent Interviews */}

      <div className="dashboard-section">

        <h2>Recent Interviews</h2>

        <div className="interview-list">

          <div className="interview-row">

            <div>
              <h3>Python Developer</h3>
              <p>Technical Interview</p>
            </div>

            <strong>82%</strong>

          </div>


          <div className="interview-row">

            <div>
              <h3>Java Developer</h3>
              <p>Technical Interview</p>
            </div>

            <strong>76%</strong>

          </div>


          <div className="interview-row">

            <div>
              <h3>Data Scientist</h3>
              <p>AI/ML Interview</p>
            </div>

            <strong>88%</strong>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;