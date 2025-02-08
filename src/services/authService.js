// Mock user database
const users = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  {
    username: 'viewer',
    password: 'viewer123',
    role: 'viewer',
    name: 'Viewer User'
  },
  {
    username: 'testcase1',
    password: 'test123',
    role: 'testcase',
    name: 'Test Case 1'
  },
  {
    username: 'testcase2',
    password: 'test123',
    role: 'testcase',
    name: 'Test Case 2'
  }
];

export const authenticateUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Store user info in localStorage (never store passwords!)
    const userInfo = {
      username: user.username,
      role: user.role,
      name: user.name
    };
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', 'mock-jwt-token');
    return { success: true, user: userInfo };
  }

  return { success: false, error: 'Invalid username or password' };
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
