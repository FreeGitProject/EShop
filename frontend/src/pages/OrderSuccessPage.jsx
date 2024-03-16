import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";

const OrderSuccessPage = () => {
  const location = useLocation(); // Declare location outside JSX
  const orderId = location.state ? location.state.orderId : null; // Get orderId from location state

  return (
    <div>
      <Header />
      <Success orderId={orderId} /> {/* Pass orderId as a prop */}
      <Footer />
    </div>
  );
};

const Success = ({ orderId }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-4 text-[25px] text-[#000000a1]">
        Order No:{"#"}{orderId} {/* Display order number here */}
      </h5>
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
