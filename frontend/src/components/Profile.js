import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import Header from "./Header";

function Profile() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
    <Header />
    <nav className={sidebar ? "sidebar active" : "sidebar"}>
      <button className="hamburger" type="button" onClick={showSidebar}>
        <div></div>
      </button>
      <ul onClick={showSidebar}>
       
        <li><Link to="/">Home</Link></li>
        <li><Link to="/services">Details</Link></li>
        
      </ul>
    </nav>
    </>
  );
}

export default Profile;