import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        Interview<span>IQ</span>
      </Link>

      <div className="nav-links">

        <a href="#features">
          Features
        </a>

        <a href="#how-it-works">
          How It Works
        </a>

        <Link to="/login" className="login-btn">
          Login
        </Link>

      </div>

    </nav>
  );
};

export default Navbar;