import { Link } from "react-router-dom";
import { Auth } from "../contexts/Auth";
import { requestLogout } from "../api";

import "./style/Navbar.scss"; // Import your CSS file here

export const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = Auth.use();

  const logout = (e: React.MouseEvent) => {
    e.preventDefault();
    requestLogout();
    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar">
      {" "}
      {/* Add the 'navbar' class here */}
      <Link to="/" className="navbar-brand">
        <img
          src="Schoonderwolf-diensten_logo.png"
          alt="Company Logo"
          className="navbar-logo img-fluid" // Keep the image responsive
          style={{ maxWidth: "150px" }} // Increase the maximum width
        />
      </Link>
      {isLoggedIn ? (
        <>
          <a href="/auth/logout" onClick={logout} className="logout">
            {" "}
            {/* Apply 'logout' class here */}
            Logout
          </a>
        </>
      ) : (
        <>
          <Link to="/auth/login">Login</Link>
        </>
      )}
    </nav>
  );
};
