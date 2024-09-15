import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { getUser } from './auth';  // Import getUser from auth.js
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Test from './components/Test';

const App = () => {
  const [user, setUser] = useState(null);  // To store user data
  const [loading, setLoading] = useState(true);  // To manage loading state

  // Function to check user authentication status
  const checkAuth = async () => {
    setLoading(true);  // Start loading
    try {
      const userData = await getUser();  // Use getUser from auth.js
      setUser(userData);  // Set the user data if authenticated
    } catch (error) {
      console.error('Error checking user authentication:', error);
    } finally {
      setLoading(false);  // Stop loading once the request is complete
    }
  };

  useEffect(() => {
    checkAuth();  // Check authentication when the app loads
  }, []);

  // Protect the dashboard route
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;  // Show loading while authentication is being checked
    }
    return user ? children : <Navigate to="/login" />;  // Redirect to login if not authenticated
  };

  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* Register route */}

        {/* Private dashboard route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute>
                  <Test/>
            </PrivateRoute>
          }
        />

        {/* Redirect root to dashboard or login depending on authentication */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
