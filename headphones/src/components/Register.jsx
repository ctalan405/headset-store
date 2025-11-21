import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/register/', formData);
      setMessage('User registered successfully!');
    } catch (error) {
      setMessage('Registration failed: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center">Register</h2>
        
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter username"
            autoFocus
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            type="email"
            placeholder="Enter email"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            type="password"
            placeholder="Enter password"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>
        
        <button className="btn btn-success w-100" onClick={handleRegister}>Register</button>

        {message && (
          <div className={`alert mt-3 ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
