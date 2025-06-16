import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.json();
      setCategories(data);
    } catch (error) {
      console.error(`Error fetching categories:`, error);
    }
  };

  return <ProductForm />;
};

export default AdminProductCreate;
