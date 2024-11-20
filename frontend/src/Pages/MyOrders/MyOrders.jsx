import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../Assets/assets";

const OrderItem = ({ order }) => (
  <div className="my-orders-order">
    <img src={assets.parcel_icon} alt="box" />
    <p>
      {order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}
    </p>
    <p>${order.amount}.00</p>
    <p>Items: {order.items.length}</p>
    <p>
      <span>&#x25cf;</span>
      <b>{order.status}</b>
    </p>
  </div>
);

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {isLoading && <p>Loading orders...</p>}
      {hasError && <p className="error">No orders found.</p>}
      {!isLoading && !hasError && (
        <div className="container">
          {data.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            data.map((order, index) => <OrderItem key={index} order={order} />)
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
