// src/admin/Orders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllOrders = async () => {
    if (!token) {
      toast.error("No token found. Please login as admin.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data && response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data?.message || "Failed to fetch orders");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to fetch orders";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // inside Orders.jsx
  const updateStatus = async (orderId, newStatus) => {
    // optimistic UI update (store old state to rollback if needed)
    let previousOrders;
    setOrders(prev => {
      previousOrders = prev;
      return prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o));
    });

    setUpdatingId(orderId);
    try {
      // call backend to persist change
      // endpoint: POST /api/order/update-status
      // payload: { id, status }
      // headers: { token } to match previous requests — change to Authorization if your backend uses Bearer
      const resp = await axios.post(
        `${BACKEND_URL}/api/order/updateStatus`,
        { id: orderId, status: newStatus },
        { headers: { token } }
      );

      if (!(resp.data && resp.data.success)) {
        // server responded with failure — rollback
        setOrders(previousOrders);
        toast.error(resp.data?.message || "Failed to update order status");
      } else {
        // optionally, sync local order with returned order from server
        const updatedOrder = resp.data.order;
        if (updatedOrder) {
          setOrders(prev => prev.map(o => (o._id === orderId ? updatedOrder : o)));
        }
        toast.success("Order status updated");
      }
    } catch (err) {
      // network / server error — rollback
      setOrders(previousOrders);
      toast.error(err.response?.data?.message || err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };


  const formatMoney = (value) => {
    if (value == null) return "-";
    if (typeof value === "number") {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${value}`;
  };

  // Convert address (string or object) to multiline string
  const formatAddress = (addr) => {
    if (!addr) return "-";
    if (typeof addr === "string") return addr;
    if (typeof addr === "object") {
      const parts = [];
      const name = `${addr.firstName || ""} ${addr.lastName || ""}`.trim();
      if (name) parts.push(name);
      if (addr.street) parts.push(addr.street);
      // city, state, zip
      const cityLine = [addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
      if (cityLine) parts.push(cityLine);
      if (addr.country) parts.push(addr.country);
      if (addr.phone) parts.push(addr.phone);
      // fallback to email if present and nothing else
      if (parts.length === 0 && addr.email) parts.push(addr.email);
      return parts.join("\n") || "-";
    }
    return String(addr);
  };

  // User display helper: returns a string, never the raw object
  const formatUser = (u) => {
    if (!u) return "-";
    if (typeof u === "string") return u;
    if (typeof u === "object") {
      return u.name || u.email || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "-";
    }
    return String(u);
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 14, fontWeight: 600 }}>Order Page</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={fetchAllOrders} disabled={loading} style={buttonStyle}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {orders.map((order) => {
            const items = order.cartItems || order.items || [];
            const itemsCount = items.reduce((s, it) => s + (it.qty || 1), 0);
            const createdAt = order.date ? new Date(order.date).toDateString() : "-";
            const rawAddress = order.shippingAddress || order.address || order.deliveryAddress || "-";
            const phone = order.user?.phone || order.phone || (order.user?.mobile) || "";
            const status = order.status ?? (order.isDelivered ? "Delivered" : "Order Placed");
            return (
              <div
                key={order._id || order.id}
                style={{
                  border: "1px solid #e6e6e6",
                  borderRadius: 6,
                  padding: 16,
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                  background: "#fff",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ width: 72, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa"
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8a1 1 0 0 0-.553-.894l-8-4a1 1 0 0 0-.894 0l-8 4A1 1 0 0 0 3 8v8a1 1 0 0 0 .553.894l8 4a1 1 0 0 0 .894 0l8-4A1 1 0 0 0 21 16z" stroke="#666" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 9l5 3 5-3" stroke="#666" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 22V13" stroke="#666" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
                    {items.length === 0 ? <span style={{ color: "#777" }}>No items</span> :
                      items.map((it, idx) => (
                        <div key={idx} style={{ marginBottom: 6 }}>
                          <span>{it.name}</span>
                          {it.quantity ? <span>{` x ${it.quantity} ${it.size}`}</span> : <span>{` x ${it.quantity}`}</span>}
                        </div>
                      ))
                    }
                  </div>

                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.4 }}>
                    <div style={{ whiteSpace: "pre-line" }}>
                      {order.shopName ? <div>{order.shopName}</div> : null}
                      {/* Safely render address (string or object) */}
                      {formatAddress(rawAddress).split("\n").map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                    {phone && <div style={{ marginTop: 8 }}>{phone}</div>}
                  </div>
                </div>

                <div style={{ width: 240, display: "flex", flexDirection: "column",alignItems: "flex-end" }}>
                  <div style={{ alignSelf: "stretch", display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ fontSize: 13, color: "#444" }}>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: "#888" }}>Items: <span style={{ color: "#222" }}>{itemsCount}</span></div>
                        <div style={{ fontSize: 12, color: "#888" }}>Method: <span style={{ color: "#222" }}>{order.paymentMethod || order.method || "COD"}</span></div>
                        <div style={{ fontSize: 12, color: "#888" }}>Payment: <span style={{ color: "#222" }}>{order.paymentStatus || (order.isPaid ? "Paid" : "Pending") || "Pending"}</span></div>
                        <div style={{ fontSize: 12, color: "#888" }}>Date: <span style={{ color: "#222" }}>{createdAt}</span></div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", minWidth: 90 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                        {formatMoney(order.totalPrice ?? order.amount ?? order.total ?? "-")}
                      </div>

                      <select
                        value={status}
                        onChange={(e) => updateStatus(order._id || order.id, e.target.value)}
                        disabled={updatingId === (order._id || order.id)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 4,
                          border: "1px solid #ddd",
                          background: "#fff",
                        }}
                      >
                        <option>Order Placed</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 500,
};

export default Orders;
