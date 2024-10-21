import React from "react";
import "./Siderbar.css";
import {assets} from '../../assets/assets'
import { NavLink } from "react-router-dom";

const Siderbar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to='add' className="sidebar-option">
          <img src={assets.add_icon} alt="icon"/>
          <p>Add Items</p>
        </NavLink>
        <NavLink to='list' className="sidebar-option">
          <img src={assets.order_icon} alt="icon"/>
          <p>List Items</p>
        </NavLink>
        <NavLink to='orders' className="sidebar-option">
          <img src={assets.order_icon} alt="icon"/>
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Siderbar;
