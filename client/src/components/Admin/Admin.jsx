import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSideBar from './AdminSideBar.jsx';
import AdminRequestList from './AdminRequestList.jsx';
import AdminDashboard from './AdminDashboard.jsx';

const Admin = () => {
  const location = useLocation();

  return (
    <div className="admin-panel">
      <AdminSideBar />

      <div className="admin-content">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="/request" element={<AdminRequestList />} />

        </Routes>
      </div>
    </div>
  );
};

export default Admin;
