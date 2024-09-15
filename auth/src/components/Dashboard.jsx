import React from 'react';
import { logoutUser } from '../auth';  // Import the logout function

const Dashboard = ({ user }) => {
  const handleLogout = async () => {
    try {
      await logoutUser();  // Call logout function
      window.location.href = '/login';  // Redirect to login after logging out
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <div>
      <h1>Welcome, {user ? user.username : 'Guest'}</h1>
      {/* Your dashboard content */}
      <button onClick={handleLogout}>Logout</button>  {/* Logout button */}
    </div>
  );
};

export default Dashboard;
