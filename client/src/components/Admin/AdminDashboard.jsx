import React from 'react';
import './Admin.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSideBar from './AdminSideBar.jsx';
import AdminRequestList from './AdminRequestList.jsx';
import AdminBookingList from './AdminBookingList.jsx';

const Admin = () => {
  const location = useLocation();

  return (
    <div className="admin-panel">
      <AdminSideBar />

      <div className="admin-content">
        <Routes>
          <Route path="/request" element={<AdminRequestList />} />
          <Route path="/bookings" element={<AdminBookingList />} />

        </Routes>
      </div>
    </div>
  );
};

export default Admin;
