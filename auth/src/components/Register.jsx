import React, { useState } from 'react';
import { userRegister } from '../auth';  // Import loginUser from auth.js

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
        const response = await userRegister(username, email, password, phoneNumber, address);  // Call loginUser function
        setSuccess('Registration Succesfully.')
    }
    catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.detail || 'Registration failed.');
      } else {
        console.error('Error message:', error.message);
        setError('Something went wrong. Please try again.');
      }
      }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
      <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address"></textarea>
      <button type="submit">Register</button>
    </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      </>
  );
};

export default Register;
