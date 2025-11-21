import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', response.data.username); 
      localStorage.setItem('role', response.data.role);        

      window.dispatchEvent(new Event('loginStatusChanged')); 

      setMessage('Login successful!');
      navigate('/'); // Redirect to homepage
    } catch (error) {
      setMessage('Login failed: ' + (error.response?.data.error || error.message));
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow" style={{ maxWidth: "350px", width: "100%" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Login</h4>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleLogin} className="btn btn-primary w-100 mb-2">Login</button>

          {message &&
            <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} mt-2`} role="alert">
              {message}
            </div>
          }

          <div className="text-center mt-3">
            <a href="/register" className="link-primary">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
