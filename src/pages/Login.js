import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = {
        id: username,
        username: username,
        role: username === 'admin' ? 'admin' : 
              username === 'strip_admin' ? 'strip_admin' : 'testcase'
      };

      await setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <style>
        {`
          .login-container {
            max-width: 400px;
            margin: 40px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background: white;
          }

          form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          h2 {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
          }

          .error {
            color: red;
            text-align: center;
            padding: 10px;
            background: #fff5f5;
            border-radius: 4px;
          }

          label {
            display: block;
            margin-bottom: 5px;
            color: #666;
          }

          input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }

          button {
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          button:hover {
            background: #45a049;
          }
        `}
      </style>
    </div>
  );
}

export default Login; 