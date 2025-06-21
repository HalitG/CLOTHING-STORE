import React, { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState([true]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError("Error fetching your orders");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((orders) => (
            <div key={orders.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{orders.id}</h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(orders.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>{getStatusBadge(orders.status)}</div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    Total Amount: $ {orders.total_amount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Items: {orders.total_items}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(orders)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Order Details #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                x
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p>Status: {getStatusBadge(selectedOrder.status)}</p>
                  <p>
                    Date:{" "}
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                  <p>Total: $ {selectedOrder.total_amount}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shipping Adress</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p>{selectedOrder.shipping_address}</p>
                  <p>
                    {selectedOrder.shipping_city},
                    {selectedOrder.shipping_postal_code}
                  </p>
                  <p>Phone: {selectedOrder.shipping_phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="border rounded-lg divide-y">
                  {selectedOrder.product_names
                    ?.split(",")
                    .map((product, index) => (
                      <div key={index} className="p-4">
                        <p className="font-medium">{product}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
