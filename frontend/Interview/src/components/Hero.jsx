import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-content">

        <p className="badge">
          🤖 AI-Powered Interview Preparation
        </p>

        <h1>
          Practice Interviews.
          <br />
          <span>Get Job Ready.</span>
        </h1>

        <p className="hero-description">
          Practice realistic interviews with AI, receive instant
          feedback, and improve your technical and communication skills.
        </p>

        <div className="hero-buttons">

          <Link to="/interview" className="primary-btn">
            Start Interview →
          </Link>

          <a href="#features" className="secondary-btn">
            Explore Features
          </a>

        </div>

      </div>

    </section>
  );
};

export default Hero;