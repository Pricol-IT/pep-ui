import React, { useEffect, useState } from 'react';

const Topbar = ({ onToggleSidebar }) => {


  return (
    <header className="topbar">


      <div className="hero-search-container">
        <i className="ti ti-search search-icon-hero"></i>
        <input type="text" className="hero-search-input" placeholder="Search anything here ..." />
      </div>

      <div className="topbar-actions">
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
