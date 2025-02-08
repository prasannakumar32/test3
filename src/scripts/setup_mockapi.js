const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://673842714eb22e24fca75691.mockapi.io';

// Mock data configuration
const mockData = {
  users: [
    {
      id: 'strioadmin',
      username: 'strioadmin',
      password: 'admin123',
      role: 'superuser',
      permissions: ['read', 'write', 'admin'],
      sites: [
        'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PS6',  // Solar sites
        'PW1', 'PW2', 'PW3', 'PW4', 'PW5', 'PW6', 'PW7',  // Wind sites
        'WB1', 'WB2', 'WB3',  // Wind banking sites
        'CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6', 'CS7', 'CS8', 'CS9', 'CS10', 'CS11', 'CS12'  // Consumption sites
      ]
    },
    {
      id: 'striouser',
      username: 'striouser',
      password: 'user123',
      role: 'manager',
      permissions: ['read', 'write'],
      sites: [
        'PS1', 'PS2', 'PS3', 'PS4',  // First 4 solar sites
        'PW1', 'PW2', 'PW3', 'PW4',  // First 4 wind sites
        'WB1', 'WB2',  // First 2 wind banking sites
        'CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6'  // First 6 consumption sites
      ]
    },
    {
      id: 'testcase1',
      username: 'testcase1',
      password: 'test123',
      role: 'user',
      permissions: ['read'],
      sites: [
        'PS1',         // One solar site
        'PW1',         // One wind site
        'CS1', 'CS2', 'CS3'  // Three consumption sites
      ]
    },
    {
      id: 'testcase2',
      username: 'testcase2',
      password: 'test123',
      role: 'user',
      permissions: ['read'],
      sites: [
        'PS3', 'PS4',  // Next 2 solar sites
        'PW3', 'PW4',  // Next 2 wind sites
        'WB2',         // Second wind banking site
        'CS4', 'CS5'   // Next 2 consumption sites
      ]
    },
    {
      id: 'testcase3',
      username: 'testcase3',
      password: 'test123',
      role: 'user',
      permissions: ['read'],
      sites: [
        'PS5',         // Fifth solar site
        'PW5',         // Fifth wind site
        'WB3',         // Third wind banking site
        'CS6', 'CS7'   // Next 2 consumption sites
      ]
    },
    {
      id: 'testcase4',
      username: 'testcase4',
      password: 'test123',
      role: 'user',
      permissions: ['read'],
      sites: [
        'PS6',         // Last solar site
        'PW6',         // Sixth wind site
        'CS8', 'CS9'   // Next 2 consumption sites
      ]
    },
    {
      id: 'testcase5',
      username: 'testcase5',
      password: 'test123',
      role: 'user',
      permissions: ['read'],
      sites: [
        'PW7',         // Last wind site
        'CS10', 'CS11', 'CS12'  // Last 3 consumption sites
      ]
    }
  ],
  sites: [
    // Production Sites - Solar (PS1-PS6)
    {
      id: 'PS1',
      name: 'Pudukottai Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Pudukottai, Tamil Nadu',
      capacity: '50 MW',
      status: 'Active',
      coordinates: {
        latitude: '10.3833° N',
        longitude: '78.8001° E'
      },
      description: 'Solar power generation facility in Pudukottai',
      metrics: {
        dailyGeneration: '200 MWh',
        monthlyGeneration: '6000 MWh',
        yearlyGeneration: '72000 MWh',
        efficiency: '85%'
      }
    },
    {
      id: 'PS2',
      name: 'Madurai Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Madurai, Tamil Nadu',
      capacity: '45 MW',
      status: 'Active',
      coordinates: {
        latitude: '9.9252° N',
        longitude: '78.1198° E'
      },
      description: 'Solar power generation facility in Madurai',
      metrics: {
        dailyGeneration: '180 MWh',
        monthlyGeneration: '5400 MWh',
        yearlyGeneration: '64800 MWh',
        efficiency: '83%'
      }
    },
    {
      id: 'PS3',
      name: 'Trichy Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Trichy, Tamil Nadu',
      capacity: '40 MW',
      status: 'Active',
      coordinates: {
        latitude: '10.7905° N',
        longitude: '78.7047° E'
      },
      description: 'Solar power generation facility in Trichy',
      metrics: {
        dailyGeneration: '160 MWh',
        monthlyGeneration: '4800 MWh',
        yearlyGeneration: '57600 MWh',
        efficiency: '82%'
      }
    },
    {
      id: 'PS4',
      name: 'Salem Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Salem, Tamil Nadu',
      capacity: '55 MW',
      status: 'Active',
      coordinates: {
        latitude: '11.6643° N',
        longitude: '78.1460° E'
      },
      description: 'Solar power generation facility in Salem',
      metrics: {
        dailyGeneration: '220 MWh',
        monthlyGeneration: '6600 MWh',
        yearlyGeneration: '79200 MWh',
        efficiency: '86%'
      }
    },
    {
      id: 'PS5',
      name: 'Erode Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Erode, Tamil Nadu',
      capacity: '42 MW',
      status: 'Active',
      coordinates: {
        latitude: '11.3410° N',
        longitude: '77.7172° E'
      },
      description: 'Solar power generation facility in Erode',
      metrics: {
        dailyGeneration: '168 MWh',
        monthlyGeneration: '5040 MWh',
        yearlyGeneration: '60480 MWh',
        efficiency: '84%'
      }
    },
    {
      id: 'PS6',
      name: 'Coimbatore Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Coimbatore, Tamil Nadu',
      capacity: '48 MW',
      status: 'Active',
      coordinates: {
        latitude: '11.0168° N',
        longitude: '76.9558° E'
      },
      description: 'Solar power generation facility in Coimbatore',
      metrics: {
        dailyGeneration: '192 MWh',
        monthlyGeneration: '5760 MWh',
        yearlyGeneration: '69120 MWh',
        efficiency: '85%'
      }
    },
    // Production Sites - Wind (PW1-PW7)
    {
      id: 'PW1',
      name: 'Tirunelveli Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Tirunelveli, Tamil Nadu',
      capacity: '75 MW',
      status: 'Active',
      coordinates: {
        latitude: '8.7139° N',
        longitude: '77.7567° E'
      },
      description: 'Wind power generation facility in Tirunelveli',
      metrics: {
        dailyGeneration: '300 MWh',
        monthlyGeneration: '9000 MWh',
        yearlyGeneration: '108000 MWh',
        efficiency: '80%'
      }
    },
    {
      id: 'PW2',
      name: 'Thoothukudi Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Thoothukudi, Tamil Nadu',
      capacity: '70 MW',
      status: 'Active',
      coordinates: {
        latitude: '8.7642° N',
        longitude: '78.1348° E'
      },
      description: 'Wind power generation facility in Thoothukudi',
      metrics: {
        dailyGeneration: '280 MWh',
        monthlyGeneration: '8400 MWh',
        yearlyGeneration: '100800 MWh',
        efficiency: '78%'
      }
    },
    {
      id: 'PW3',
      name: 'Kanyakumari Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Kanyakumari, Tamil Nadu',
      capacity: '80 MW',
      status: 'Active',
      coordinates: {
        latitude: '8.0883° N',
        longitude: '77.5385° E'
      },
      description: 'Wind power generation facility in Kanyakumari',
      metrics: {
        dailyGeneration: '320 MWh',
        monthlyGeneration: '9600 MWh',
        yearlyGeneration: '115200 MWh',
        efficiency: '82%'
      }
    },
    {
      id: 'PW4',
      name: 'Ramanathapuram Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Ramanathapuram, Tamil Nadu',
      capacity: '65 MW',
      status: 'Active',
      coordinates: {
        latitude: '9.3639° N',
        longitude: '78.8395° E'
      },
      description: 'Wind power generation facility in Ramanathapuram',
      metrics: {
        dailyGeneration: '260 MWh',
        monthlyGeneration: '7800 MWh',
        yearlyGeneration: '93600 MWh',
        efficiency: '77%'
      }
    },
    {
      id: 'PW5',
      name: 'Dindigul Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Dindigul, Tamil Nadu',
      capacity: '72 MW',
      status: 'Active',
      coordinates: {
        latitude: '10.3624° N',
        longitude: '77.9695° E'
      },
      description: 'Wind power generation facility in Dindigul',
      metrics: {
        dailyGeneration: '288 MWh',
        monthlyGeneration: '8640 MWh',
        yearlyGeneration: '103680 MWh',
        efficiency: '79%'
      }
    },
    {
      id: 'PW6',
      name: 'Theni Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Theni, Tamil Nadu',
      capacity: '68 MW',
      status: 'Active',
      coordinates: {
        latitude: '10.0104° N',
        longitude: '77.4768° E'
      },
      description: 'Wind power generation facility in Theni',
      metrics: {
        dailyGeneration: '272 MWh',
        monthlyGeneration: '8160 MWh',
        yearlyGeneration: '97920 MWh',
        efficiency: '78%'
      }
    },
    {
      id: 'PW7',
      name: 'Tirupur Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Tirupur, Tamil Nadu',
      capacity: '77 MW',
      status: 'Active',
      coordinates: {
        latitude: '11.1085° N',
        longitude: '77.3411° E'
      },
      description: 'Wind power generation facility in Tirupur',
      metrics: {
        dailyGeneration: '308 MWh',
        monthlyGeneration: '9240 MWh',
        yearlyGeneration: '110880 MWh',
        efficiency: '81%'
      }
    },
    // Wind Banking Sites (WB1-WB3)
    {
      id: 'WB1',
      name: 'Coimbatore Wind Banking',
      type: 'WIND',
      siteType: 'BANKING',
      location: 'Coimbatore, Tamil Nadu',
      capacity: '120 MW',
      status: 'Active',
      coordinates: {
        latitude: '11.0168° N',
        longitude: '76.9558° E'
      },
      description: 'Wind banking facility in Coimbatore',
      metrics: {
        dailyGeneration: '480 MWh',
        monthlyGeneration: '14400 MWh',
        yearlyGeneration: '172800 MWh',
        efficiency: '85%'
      }
    },
    {
      id: 'WB2',
      name: 'Tirunelveli Wind Banking',
      type: 'WIND',
      siteType: 'BANKING',
      location: 'Tirunelveli, Tamil Nadu',
      capacity: '110 MW',
      status: 'Active',
      coordinates: {
        latitude: '8.7139° N',
        longitude: '77.7567° E'
      },
      description: 'Wind banking facility in Tirunelveli',
      metrics: {
        dailyGeneration: '440 MWh',
        monthlyGeneration: '13200 MWh',
        yearlyGeneration: '158400 MWh',
        efficiency: '83%'
      }
    },
    {
      id: 'WB3',
      name: 'Thoothukudi Wind Banking',
      type: 'WIND',
      siteType: 'BANKING',
      location: 'Thoothukudi, Tamil Nadu',
      capacity: '100 MW',
      status: 'Active',
      coordinates: {
        latitude: '8.7642° N',
        longitude: '78.1348° E'
      },
      description: 'Wind banking facility in Thoothukudi',
      metrics: {
        dailyGeneration: '400 MWh',
        monthlyGeneration: '12000 MWh',
        yearlyGeneration: '144000 MWh',
        efficiency: '82%'
      }
    }
  ],
  production: [
    {
      id: 'PS1',
      siteId: 'PS1',
      timestamp: new Date().toISOString(),
      month_year: new Date().toISOString().slice(0, 7),
      site_name: 'Pudukottai Solar Plant',
      c1: 250.5,
      c2: 300.75,
      c3: 275.25,
      c4: 325.5,
      import: 50.0,
      export: 150.0,
      total_generation: 1152.0,
      status: 'active'
    },
    {
      id: 'PW1',
      siteId: 'PW1',
      timestamp: new Date().toISOString(),
      month_year: new Date().toISOString().slice(0, 7),
      site_name: 'Tirunelveli Wind Banking',
      c1: 280.0,
      c2: 310.5,
      c3: 295.75,
      c4: 315.25,
      import: 45.0,
      export: 160.0,
      total_generation: 1201.5,
      status: 'active'
    }
  ],
  consumption: [
    {
      id: 'CS1',
      siteId: 'CS1',
      name: 'Polyspin Exports Ltd Expansion Unit',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Rajapalayam, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '100 MWh',
        monthlyConsumption: '3000 MWh',
        yearlyConsumption: '36000 MWh',
        peakDemand: '15 MW'
      }
    },
    {
      id: 'CS2',
      siteId: 'CS2',
      name: 'PEL Textiles',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Rajapalayam, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '80 MWh',
        monthlyConsumption: '2400 MWh',
        yearlyConsumption: '28800 MWh',
        peakDemand: '12 MW'
      }
    },
    {
      id: 'CS3',
      siteId: 'CS3',
      name: 'M/s A. Ramar and Sons',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Rajapalayam, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '90 MWh',
        monthlyConsumption: '2700 MWh',
        yearlyConsumption: '32400 MWh',
        peakDemand: '13 MW'
      }
    },
    {
      id: 'CS4',
      siteId: 'CS4',
      name: 'Sri Kumaran Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Madurai, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '95 MWh',
        monthlyConsumption: '2850 MWh',
        yearlyConsumption: '34200 MWh',
        peakDemand: '14 MW'
      }
    },
    {
      id: 'CS5',
      siteId: 'CS5',
      name: 'Thangamayil Spinning Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Madurai, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '85 MWh',
        monthlyConsumption: '2550 MWh',
        yearlyConsumption: '30600 MWh',
        peakDemand: '13 MW'
      }
    },
    {
      id: 'CS6',
      siteId: 'CS6',
      name: 'Sri Shanmugavel Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Salem, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '110 MWh',
        monthlyConsumption: '3300 MWh',
        yearlyConsumption: '39600 MWh',
        peakDemand: '16 MW'
      }
    },
    {
      id: 'CS7',
      siteId: 'CS7',
      name: 'Kandagiri Spinning Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Salem, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '105 MWh',
        monthlyConsumption: '3150 MWh',
        yearlyConsumption: '37800 MWh',
        peakDemand: '15 MW'
      }
    },
    {
      id: 'CS8',
      siteId: 'CS8',
      name: 'Ramco Industries',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Virudhunagar, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '120 MWh',
        monthlyConsumption: '3600 MWh',
        yearlyConsumption: '43200 MWh',
        peakDemand: '17 MW'
      }
    },
    {
      id: 'CS9',
      siteId: 'CS9',
      name: 'Premier Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Coimbatore, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '115 MWh',
        monthlyConsumption: '3450 MWh',
        yearlyConsumption: '41400 MWh',
        peakDemand: '16 MW'
      }
    },
    {
      id: 'CS10',
      siteId: 'CS10',
      name: 'Lakshmi Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Coimbatore, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '125 MWh',
        monthlyConsumption: '3750 MWh',
        yearlyConsumption: '45000 MWh',
        peakDemand: '18 MW'
      }
    },
    {
      id: 'CS11',
      siteId: 'CS11',
      name: 'Eastern Spinners',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Erode, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '95 MWh',
        monthlyConsumption: '2850 MWh',
        yearlyConsumption: '34200 MWh',
        peakDemand: '14 MW'
      }
    },
    {
      id: 'CS12',
      siteId: 'CS12',
      name: 'Sree Rangavilas Mills',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Coimbatore, Tamil Nadu',
      status: 'Active',
      metrics: {
        dailyConsumption: '130 MWh',
        monthlyConsumption: '3900 MWh',
        yearlyConsumption: '46800 MWh',
        peakDemand: '19 MW'
      }
    }
  ],
};

const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'  // Explicitly set the WebSocket path
});

// WebSocket error handling
wss.on('error', (error) => {
  console.error('WebSocket Server Error:', error);
});

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('Client connected to WebSocket');
  
  // Send initial data
  const sites = ['PS1', 'PW1', 'CS1', 'CS2', 'CS3', 'PS2', 'PS3', 'PS4', 'PS5', 'PS6', 'PW2', 'PW3', 'PW4', 'PW5', 'PW6', 'PW7', 'WB1', 'WB2', 'WB3'];
  sites.forEach(siteId => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: siteId.startsWith('P') ? 'PRODUCTION_UPDATE' : (siteId.startsWith('PW') ? 'PRODUCTION_UPDATE' : 'CONSUMPTION_UPDATE'),
        payload: generateMockData(siteId)
      }));
    }
  });

  // Set up periodic updates
  const intervals = sites.map(siteId => {
    return setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: siteId.startsWith('P') ? 'PRODUCTION_UPDATE' : (siteId.startsWith('PW') ? 'PRODUCTION_UPDATE' : 'CONSUMPTION_UPDATE'),
          payload: generateMockData(siteId)
        }));
      }
    }, 5000);
  });

  // Handle client messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data);
      
      // Echo back for testing
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'RESPONSE',
          payload: { received: data }
        }));
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Cleanup on disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    intervals.forEach(interval => clearInterval(interval));
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Mock real-time data generation
function generateMockData(siteId) {
  return {
    timestamp: new Date().toISOString(),
    siteId,
    readings: {
      C1: Math.random() * 100 + 200,  // 200-300
      C2: Math.random() * 100 + 250,  // 250-350
      C3: Math.random() * 100 + 225,  // 225-325
      C4: Math.random() * 100 + 275,  // 275-375
      C5: Math.random() * 100 + 225   // 225-325
    },
    status: 'active',
    alerts: []
  };
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function postData(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to post to ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

async function clearEndpoint(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  
  const existingData = await response.json();
  
  for (const item of existingData) {
    await fetch(`${API_BASE_URL}/${endpoint}/${item.id}`, {
      method: 'DELETE'
    });
  }
}

async function setupMockAPI() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await clearEndpoint('users');
    await clearEndpoint('sites');
    await clearEndpoint('production');
    await clearEndpoint('consumption');

    // Setup users
    console.log('Setting up users...');
    for (const user of mockData.users) {
      await postData('users', user);
    }

    // Setup sites
    console.log('Setting up sites...');
    for (const site of mockData.sites) {
      await postData('sites', site);
    }

    // Setup production data
    console.log('Setting up production data...');
    for (const prod of mockData.production) {
      await postData('production', prod);
    }

    // Setup consumption data
    console.log('Setting up consumption data...');
    for (const cons of mockData.consumption) {
      await postData('consumption', cons);
    }

    console.log('Mock API setup completed successfully!');
  } catch (error) {
    console.error('Error setting up mock API:', error);
  }
}

// Use native fetch instead of node-fetch
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

setupMockAPI();
