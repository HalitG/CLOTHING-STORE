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
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    setError("");

    try {
      const productFormData = new FormData();

      Object.keys(formData).forEach((key) => {
        productFormData.append(key, formData[key]);
      });

      images.forEach((image) => {
        productFormData.append("images", image);
      });

      const response = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: productFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      navigate("/admin/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductForm
      formData={formData}
      categories={categories}
      onSubmit={handleSubmit}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }))
      }
      onImageChange={(e) => setImages(Array.from(e.target.files))}
      loading={loading}
      error={error}
      submitText="Create Product"
      onCancel={() => navigate("/admin/products")}
    />
  );
};

export default AdminProductCreate;
