import React from 'react';

const AdminDashboard = ({ userName }) => {
  return (
    <div className="admin-dashboard">
      <h1>Welcome, {userName.first} {userName.last}</h1>
      <p>This is the Admin Dashboard</p>
      {/* Add Admin-specific components and content here */}
    </div>
  );
};

export default AdminDashboard;
