import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserContext.js';
import { getUserProfile, changePassword } from '../services/authApi.js';

const Account = () => {
  const { username } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile(username);
        setUserProfile(profile);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changePassword(username, passwordData.currentPassword, passwordData.newPassword);
      setSuccess('Password updated successfully');
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (field) => (e) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <FontAwesomeIcon 
          icon={faUser} 
          style={{ 
            fontSize: '24px', 
            marginRight: '10px',
            color: '#4CAF50' 
          }} 
        />
        <h1 style={{ margin: 0 }}>Account</h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        {/* Profile Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid #eee'
        }}>
          <FontAwesomeIcon 
            icon={faUser}
            style={{
              fontSize: '48px',
              marginRight: '20px',
              color: '#666'
            }}
          />
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>User Profile</h2>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>Username: {userProfile?.username}</p>
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>Role: {userProfile?.role}</p>
            <p style={{ margin: 0, color: '#666' }}>Email: {userProfile?.email}</p>
          </div>
        </div>

        {/* Password Change Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <FontAwesomeIcon 
              icon={faKey}
              style={{
                fontSize: '24px',
                marginRight: '10px',
                color: '#666'
              }}
            />
            <h3 style={{ margin: 0, color: '#333' }}>Password Management</h3>
          </div>

          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setError('');
                    setSuccess('');
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {error && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: '4px'
            }}>
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
