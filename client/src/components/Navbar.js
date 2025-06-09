import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
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

            <Link to="/login" className="tex-gray-600 hover:text-blue-600">
              Login
            </Link>

            <Link to="/register" className="tex-gray-600 hover:text-blue-600">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
