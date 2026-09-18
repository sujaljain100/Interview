import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="cta">

      <h2>Ready to practice?</h2>

      <p>
        Start your AI-powered mock interview today.
      </p>

      <Link
        to="/interview"
        className="primary-btn"
      >
        Start Your Interview →
      </Link>

    </section>
  );
};

export default CTA;