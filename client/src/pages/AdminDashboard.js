import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3>Total Products</h3>
          <p>{stats.products}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3>Total Revenue</h3>
          <p>{Number(stats.revenue || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit or remove products</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Manage Orders</h2>
          <p className="text-gray-600">Track and update order status</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
