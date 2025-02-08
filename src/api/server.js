// Basic server configuration and mock authentication
const mockLogin = (username, password) => {
  // Simulated authentication logic
  const validCredentials = {
    username: 'admin',
    password: 'password'
  };

  if (username === validCredentials.username && password === validCredentials.password) {
    return {
      success: true,
      user: {
        id: '1',
        username: username,
        role: 'admin',
        token: 'mock-jwt-token'
      }
    };
  }

  return {
    success: false,
    error: 'Invalid credentials'
  };
};

export const login = async (username, password) => {
  try {
    const result = mockLogin(username, password);
    
    if (result.success) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('token', result.user.token);
      
      return result.user;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
