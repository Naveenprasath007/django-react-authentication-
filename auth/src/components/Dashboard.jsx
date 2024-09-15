import React, { useState } from 'react';
import { logoutUser,saveCreativeInfo } from '../auth';  // Import the logout function


const Dashboard = ({ user }) => {
  const [creativeInfo, setCreativeInfo] = useState('');
  const [error, setError] = useState(null);

  // axios
  // const handleSave = async () => {
  //   try {
  //     const data = await saveCreativeInfo(creativeInfo);
  //     console.log('Creative information saved:', data);
  //     // Handle successful save (e.g., show a message or update the UI)
  //   } catch (err) {
  //     setError('Failed to save creative information');
  //   }
  // };

  // fetchapi example
  const handleSave = async () => {
    const response = await fetch(`http://localhost:8000/api/profile/save/`, {
      method: 'POST',
      body: new URLSearchParams({
        creative_info: creativeInfo      
      }),     
        credentials: 'include', // Ensure cookies are sent with the request
    });

    const result = await response.text();
    console.log(result);
  };

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
      <textarea
        value={creativeInfo}
        onChange={(e) => setCreativeInfo(e.target.value)}
        placeholder="Enter your creative information here"
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleLogout}>Logout</button>  {/* Logout button */}
    </div>
  );
};

export default Dashboard;
