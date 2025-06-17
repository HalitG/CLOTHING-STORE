import React, { useState, useEffect, use } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
  });
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category_id: data.category_id,
        stock: data.stock,
      });
      if (data.images) {
        setCurrentImages(data.images.split(","));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error loading products");
    }
  };

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

      newImages.forEach((image) => {
        productFormData.append("images", image);
      });

      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: productFormData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      navigate("/admin/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/admin/products/${id}/images/${imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          setCurrentImages((prev) => prev.filter((img) => img !== imageId));
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
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
      onImageChange={(e) => setNewImages(Array.from(e.target.files))}
      loading={loading}
      error={error}
      submitText="Update Product"
      currentImages={currentImages}
      onDeleteImage={handleDeleteImage}
      isEdit={true}
      onCancel={() => navigate("/admin/products")}
    />
  );
};

export default AdminProductEdit;
