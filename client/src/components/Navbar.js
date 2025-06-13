import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Fashion Store
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/products" className="tex-gray-600 hover:text-blue-600">
              Products
            </Link>

            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="tex-gray-600 hover:text-blue-600">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="tex-gray-600 hover:text-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
