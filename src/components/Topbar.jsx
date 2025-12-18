import React, { useEffect, useState } from 'react';

const Topbar = ({ onToggleSidebar }) => {


  return (
    <header className="topbar">


      <div className="hero-search-container">
        <i className="ti ti-search search-icon-hero"></i>
        <input type="text" className="hero-search-input" placeholder="Search anything here ..." />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn hero-notification-btn">
          <i className="ti ti-bell"></i>
          <span className="badge-dot"></span>
        </button>

        <div className="user">
          <div className="avatar">
            <img src="https://lms.mypricol.net.in/pluginfile.php/58/user/icon/space/f1?rev=143" alt="Rubesh" />
            <div className="status-indicator"></div>
          </div>
          <div className="user-info">
            <div className="user-name">RUBESH K R</div>
            <div className="user-role">rubesh.kr@pricol.com</div>
          </div>
          <div className="user-dropdown">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
        <button
          className="hamburger"
          id="btn-nav"
          aria-label="Toggle navigation"
          onClick={onToggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
