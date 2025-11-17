import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    boughtProperties: 0,
    rentedProperties: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch colors from CSS variables
  const colors = {
    primary: getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim(),
    secondary: getComputedStyle(document.documentElement).getPropertyValue("--color-secondary").trim(),
    accent: getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim(),
    text: getComputedStyle(document.documentElement).getPropertyValue("--color-text").trim(),
    highlight: getComputedStyle(document.documentElement).getPropertyValue("--color-highlight").trim(),
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <h2 className="loading-text">Loading Dashboard Data...</h2>
      </div>
    );
  }

  const { totalProperties, availableProperties, boughtProperties, rentedProperties, totalUsers } = stats;

  // ✅ Chart Data
  const barData = [
    { name: "Total", count: totalProperties },
    { name: "Available", count: availableProperties },
    { name: "Bought", count: boughtProperties },
    { name: "Rented", count: rentedProperties },
    { name: "Users", count: totalUsers },
  ];

  const pieData = [
    { name: "Available", value: availableProperties },
    { name: "Bought", value: boughtProperties },
    { name: "Rented", value: rentedProperties },
  ];

  // ✅ Use your theme colors for chart styling
  const BAR_COLORS = [colors.primary, colors.secondary, colors.highlight, colors.text, "#9E9E9E"];
  const PIE_COLORS = [colors.primary, colors.secondary, colors.highlight];

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <h2 style={{ color: colors.primary }}>Dashboard Overview</h2>
        <p className="welcome-msg" style={{ color: colors.highlight }}>
          Welcome to <b style={{ color: colors.text }}>Elite Estate</b> Admin Panel — manage properties, sales, rentals, and users efficiently.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <h3>Total Properties</h3>
          <p>{totalProperties}</p>
        </div>
        <div className="dashboard-card" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <h3>Available</h3>
          <p>{availableProperties}</p>
        </div>
        <div className="dashboard-card" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <h3>Bought</h3>
          <p>{boughtProperties}</p>
        </div>
        <div className="dashboard-card" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <h3>Rented</h3>
          <p>{rentedProperties}</p>
        </div>
        <div className="dashboard-card" style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card" style={{ backgroundColor: colors.accent }}>
          <h3 style={{ color: colors.primary }}>Overview (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.highlight} />
              <XAxis dataKey="name" stroke={colors.secondary} />
              <YAxis stroke={colors.secondary} />
              <Tooltip />
              <Bar dataKey="count">
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{ backgroundColor: colors.accent }}>
          <h3 style={{ color: colors.primary }}>Property Distribution (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
