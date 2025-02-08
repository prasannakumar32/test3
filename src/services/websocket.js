class WebSocketClient {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.listeners = new Map();
    this.isConnected = false;
    
    // Get WebSocket URL from environment or use default
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.REACT_APP_WS_HOST || window.location.hostname;
    const wsPort = process.env.REACT_APP_WS_PORT || '3000';  // Changed to 3000 to match development server
    this.url = `${wsProtocol}//${wsHost}:${wsPort}/ws`;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    try {
      console.log('Connecting to WebSocket at:', this.url);
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket Connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyListeners('connect', { status: 'connected' });
      };

      this.socket.onclose = (event) => {
        if (!this.isConnected) {
          // If we were never connected, don't show the disconnection message
          return;
        }
        console.log('WebSocket Disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.notifyListeners('disconnect', { status: 'disconnected', code: event.code, reason: event.reason });
        
        // Only attempt reconnect if it wasn't a clean close
        if (event.code !== 1000) {
          this.attemptReconnect();
        }
      };

      this.socket.onerror = (error) => {
        // Only log WebSocket errors if we were previously connected
        if (this.isConnected) {
          console.error('WebSocket Error:', error);
          this.notifyListeners('error', { error });
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      if (this.isConnected) {
        console.error('Error creating WebSocket connection:', error);
      }
      this.attemptReconnect();
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    
    switch (type) {
      case 'PRODUCTION_UPDATE':
      case 'BANKING_UPDATE':
      case 'CONSUMPTION_UPDATE':
        this.handleSiteUpdate(data);
        break;
      case 'SITE_STATUS':
        this.notifyListeners('siteStatus', payload);
        break;
      case 'ALERT':
        this.notifyListeners('alert', payload);
        break;
      default:
        console.log('Unknown message type:', type);
    }
  }

  handleSiteUpdate(data) {
    const { type, payload } = data;
    const siteId = payload.siteId;

    // Handle production sites (Solar and Wind)
    if (type === 'PRODUCTION_UPDATE') {
      if (siteId.startsWith('PS')) {
        // Solar production update
        this.handleSolarUpdate(payload);
      } else if (siteId.startsWith('PW')) {
        // Wind production update
        this.handleWindUpdate(payload);
      }
    } 
    // Handle wind banking sites
    else if (type === 'BANKING_UPDATE') {
      this.handleBankingUpdate(payload);
    }
    // Handle consumption sites
    else if (type === 'CONSUMPTION_UPDATE') {
      this.handleConsumptionUpdate(payload);
    }
  };

  handleSolarUpdate(data) {
    const { siteId, timestamp, metrics } = data;
    // Update solar site metrics
    this.updateSiteData(siteId, {
      type: 'SOLAR',
      timestamp,
      ...metrics
    });
    this.notifyListeners('productionUpdate', {
      type: 'SOLAR',
      timestamp,
      ...metrics
    });
  };

  handleWindUpdate(data) {
    const { siteId, timestamp, metrics } = data;
    // Update wind site metrics
    this.updateSiteData(siteId, {
      type: 'WIND',
      timestamp,
      ...metrics
    });
    this.notifyListeners('productionUpdate', {
      type: 'WIND',
      timestamp,
      ...metrics
    });
  };

  handleBankingUpdate(data) {
    const { siteId, timestamp, metrics } = data;
    // Update banking site metrics
    this.updateSiteData(siteId, {
      type: 'BANKING',
      timestamp,
      ...metrics
    });
    this.notifyListeners('bankingUpdate', {
      type: 'BANKING',
      timestamp,
      ...metrics
    });
  };

  handleConsumptionUpdate(data) {
    const { siteId, timestamp, metrics } = data;
    // Update consumption site metrics
    this.updateSiteData(siteId, {
      type: 'CONSUMPTION',
      timestamp,
      ...metrics
    });
    this.notifyListeners('consumptionUpdate', {
      type: 'CONSUMPTION',
      timestamp,
      ...metrics
    });
  };

  updateSiteData(siteId, data) {
    // TO DO: implement site data update logic
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  sendMessage(type, payload) {
    if (!this.isConnected) {
      console.error('Cannot send message: WebSocket is not connected');
      return;
    }

    try {
      const message = JSON.stringify({ type, payload });
      this.socket.send(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
    }
  }
}

// Create singleton instance
const wsClient = new WebSocketClient();

export default wsClient;
