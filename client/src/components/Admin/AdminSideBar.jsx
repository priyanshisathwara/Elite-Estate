import React, { useState } from 'react';
import './AdminSideBar.css';
import { Link } from 'react-router-dom';

const AdminSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
            <div className="sidebar">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isOpen ? 'Close' : 'Open'}
                </button>
                <ul className="menu">
                    <li><Link to="/admin">Home</Link></li>
                    <li><Link to="/admin/request">Request</Link></li>
                    <li><Link to="/admin/bookings">Bookings</Link></li> 
                </ul>

            </div>
            <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
        </div>
    );
};

export default AdminSideBar;
