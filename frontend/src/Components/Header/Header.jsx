import React from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Order your <br/>favorite bread here</h2>
        <p>
          Choose from a wide variety of artisan breads, irresistible sweets and
          savory savories, all made with the finest ingredients and the purest
          dedication. Our mission is to satisfy your cravings and elevate your
          experience with each delicious bite, one warm roll at a time.
        </p>
        <button onClick={() => window.location.href = "#explore-menu"}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
