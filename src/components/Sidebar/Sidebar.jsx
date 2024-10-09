import React from "react";
import "./sidebar.css";
import { FaHome, FaHistory } from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions } from "react-icons/md";
import { FaSquareYoutube } from "react-icons/fa6";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-flex">
        <FaHome /> <span> Home </span>
      </div>
      <div className="sidebar-flex">
        <SiYoutubeshorts />
        <span> Shorts </span>
      </div>
      <div className="sidebar-flex">
        <MdSubscriptions />
        <span>Subscriptions</span>
      </div>
      <div className="sidebar-flex">
        <FaSquareYoutube />
        <span> You </span>
      </div>
      <div className="sidebar-flex">
        <FaHistory />
        <span> History</span>
      </div>
    </div>
  );
};

export default Sidebar;
