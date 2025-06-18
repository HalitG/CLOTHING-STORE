import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartIcon from "./CartIcon";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
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
            {/* Public links */}
            {!isAdmin() && (
              <Link to="/products" className="tex-gray-600 hover:text-blue-600">
                Products
              </Link>
            )}

            {/* Authenticated User Links */}
            {user ? (
              <>
                {isAdmin() ? (
                  <div className="flex items-center space-x-6">
                    <Link
                      to="/admin"
                      className="text-gray600 hover:text-blue-600"
                    >
                      Admin Dashboard
                    </Link>

                    <Link
                      to="/admin/products"
                      className="text-gray600 hover:text-blue-600"
                    >
                      Products
                    </Link>
                  </div>
                ) : (
                  // Regular User Links
                  <div className="flex items-center space-x-6">
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      My Orders
                    </Link>
                    <CartIcon />
                  </div>
                )}

                <button onClick={handleLogout}>Logout</button>
              </>
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
