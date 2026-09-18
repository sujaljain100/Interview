const Features = () => {
  return (
    <section className="features" id="features">

      <h2>Everything you need to prepare</h2>

      <p className="section-description">
        Practice smarter with AI-powered interview tools.
      </p>

      <div className="feature-container">

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Interviews</h3>
          <p>
            Get realistic interview questions generated according
            to your role and experience.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Performance Analysis</h3>
          <p>
            Understand your strengths, weaknesses and overall
            interview performance.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💡</div>
          <h3>Instant Feedback</h3>
          <p>
            Receive AI-generated feedback and suggestions after
            every answer.
          </p>
        </div>

      </div>

    </section>
  );
};

export default Features;    