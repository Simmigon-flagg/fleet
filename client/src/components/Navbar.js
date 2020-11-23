import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import auth from "../services/auth";
const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a></a>
      <Link
        className="navbar-brand"
        to="/"
      >
        {" "}
        GM Fleet
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav mr-auto">
  
          {user && user.isAdmin == true ? (
            <>
              <li className="nav-item active">
                <Link
                  className="nav-link"
                  to="/fleet"
                  onClick={async () => {
               
                  }}
                >
                  {" "}
                  Fleet
                </Link>
              </li>{" "}
            </>
          ) : null}
        </ul>
        {user && user.name ? (
          
            <Link
              to="/"
              onClick={async () => {
                await auth.logout();
                localStorage.clear();
                setUser(null);
              }}
            >
              {" "}
              Logout
            </Link>
          
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
