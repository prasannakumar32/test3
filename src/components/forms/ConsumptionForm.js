import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext.js';
import { reports, getSites } from '../../services/api.js';

const ConsumptionForm = ({ siteImages }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    month_year: '',
    c1: '',
    c2: '',
    c3: '',
    c4: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSite, setSelectedSite] = useState(null);
  const [availableSites, setAvailableSites] = useState([]);

  // Load available sites
  useEffect(() => {
    const loadSites = async () => {
      try {
        const response = await getSites(user.username);
        if (response.success) {
          setAvailableSites(response.data);
          // Select a random site
          const randomSite = response.data[Math.floor(Math.random() * response.data.length)];
          setSelectedSite(randomSite);
        }
      } catch (error) {
        console.error('Error loading sites:', error);
      }
    };

    if (user?.username) {
      loadSites();
    }
  }, [user]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const response = await reports.getConsumption({}, user.token);
        
        if (response.success && response.data.length > 0) {
          const latestConsumption = response.data[0];
          setFormData(prev => ({
            ...prev,
            ...latestConsumption
          }));
        } else {
          // Generate random initial data
          generateRandomData();
        }
      } catch (error) {
        console.error('Load data error:', error);
        // Generate random initial data on error
        generateRandomData();
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      loadInitialData();
    }
  }, [user]);

  const generateRandomData = () => {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    setFormData({
      month_year: `${year}-${month}`,
      c1: Math.floor(Math.random() * 1000) + 500,    // 500-1500
      c2: Math.floor(Math.random() * 2000) + 1000,   // 1000-3000
      c3: Math.floor(Math.random() * 1500) + 750,    // 750-2250
      c4: Math.floor(Math.random() * 3000) + 1500    // 1500-4500
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Select a new random site for each submission
      const randomSite = availableSites[Math.floor(Math.random() * availableSites.length)];
      setSelectedSite(randomSite);

      const response = await reports.saveConsumption({
        siteId: randomSite.id,
        ...formData,
        timestamp: new Date().toISOString()
      }, user.token);

      if (response.success) {
        setSuccess(`Consumption data saved successfully for ${randomSite.name}`);
        // Generate new random data
        generateRandomData();
      } else {
        setError('Failed to save consumption data');
      }
    } catch (error) {
      setError('Failed to save consumption data');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div style={{ 
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        Loading...
      </div>
    );
  }

  const formStyle = {
    display: 'grid',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  };

  const labelStyle = {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px #1a2b3c'
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3c4c1f',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px #1a2b3c',
    transition: 'background-color 0.3s ease'
  };

  const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px #1a2b3c'
  };

  return (
    <div>
      {selectedSite && (
        <div style={{ marginBottom: '20px' }}>
          <label>Site:</label>
          <select
            value={selectedSite.id}
            onChange={(e) => setSelectedSite(availableSites.find(site => site.id === e.target.value))}
            style={inputStyle}
          >
            <option value="">Select a site</option>
            {availableSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
          {selectedSite && siteImages[selectedSite.id] && (
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <img
                src={siteImages[selectedSite.id]}
                alt={`Site ${selectedSite.id}`}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && (
          <div style={{ ...messageStyle, backgroundColor: 'rgba(255, 0, 0, 0.2)' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ ...messageStyle, backgroundColor: 'rgba(0, 255, 0, 0.2)' }}>
            {success}
          </div>
        )}
        
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Month and Year</label>
          <input
            type="month"
            name="month_year"
            value={formData.month_year}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>C1 Value</label>
          <input
            type="number"
            name="c1"
            value={formData.c1}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter C1 value"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>C2 Value</label>
          <input
            type="number"
            name="c2"
            value={formData.c2}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter C2 value"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>C3 Value</label>
          <input
            type="number"
            name="c3"
            value={formData.c3}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter C3 value"
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>C4 Value</label>
          <input
            type="number"
            name="c4"
            value={formData.c4}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Enter C4 value"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Saving...' : 'Save Consumption Data'}
        </button>
      </form>
    </div>
  );
};

export default ConsumptionForm;
