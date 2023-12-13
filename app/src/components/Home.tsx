import { Link } from "react-router-dom";
import "./style/home.scss"

export const Home = () => {
  const handleSignup = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Signing up...");
    // Implement your signup logic here
  };

  return (
    <div className="home-container">
      <h1>Welcome to Social Platform!</h1>
      <div id="signup-section">
        <h2>Create an account</h2>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Username" id="username" />
          <input type="email" placeholder="Email" id="email" />
          <input type="password" placeholder="Password" id="password" />
          <input type="bank" placeholder="u bank" id="bank" />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div id="login-section">
        <p>Already have an account?</p>
        <Link to="/auth/Login">
          <button id="login-button">Login</button>
        </Link>
      </div>
    </div>
  );
};
