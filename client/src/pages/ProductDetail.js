import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      setError("Error loading product");
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-8 text-red-600">
        {error || "Product not found"}
      </div>
    );
  }

  const images = product.images ? product.images.split(",") : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gird-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            {images.length > 0 ? (
              <img
                src={`http://localhost:5000/api/products/images/${images[selectedImages]}`}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                No image available
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImages(index)}
                  className={`relative ${
                    selectedImages === index ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <img
                    src={`http://localhost:5000/api/products/images/${image}`}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category_name}</p>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            $ {product.price}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <span
              className={`${
                product.stock > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } px-3 py-1 rounded-full text-sm font-semibold`}
            >
              {product.stock > 0
                ? `In stock (${product.stock})`
                : `out of stock`}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
