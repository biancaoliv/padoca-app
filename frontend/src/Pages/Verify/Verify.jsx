import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId,
      });

      if (response.data.success) {
        navigate("/myorders");
      } else {
        setError("Payment verification failed. Please try again.");
        setTimeout(() => navigate("/"), 3000); 
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("An error occurred during payment verification.");
      setTimeout(() => navigate("/"), 3000); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success && orderId) {
      verifyPayment();
    } else {
      setError("Invalid request. Missing parameters.");
      setTimeout(() => navigate("/"), 3000); 
      setIsLoading(false);
    }
  }, [success, orderId, navigate]);

  return (
    <div className="verify">
      {isLoading && <div className="spinner"></div>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Verify;
