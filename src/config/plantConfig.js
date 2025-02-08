export const PLANT_TYPES = {
  WIND: 'wind',
  SOLAR: 'solar'
};

export const TIME_SLOTS = {
  [PLANT_TYPES.WIND]: [
    { id: 'C1', label: 'C1 (06:00-10:00)', type: 'peak' },
    { id: 'C2', label: 'C2 (10:00-14:00)', type: 'non-peak' },
    { id: 'C3', label: 'C3 (14:00-18:00)', type: 'peak' },
    { id: 'C4', label: 'C4 (18:00-22:00)', type: 'peak' },
    { id: 'C5', label: 'C5 (22:00-06:00)', type: 'non-peak' }
  ],
  [PLANT_TYPES.SOLAR]: [
    { id: 'M1', label: 'Morning (06:00-12:00)', type: 'peak' },
    { id: 'A1', label: 'Afternoon (12:00-17:00)', type: 'peak' },
    { id: 'E1', label: 'Evening (17:00-19:00)', type: 'non-peak' }
  ]
};

export const SITES = [
  { 
    id: 'SITE001', 
    name: 'Salem', 
    type: PLANT_TYPES.WIND, 
    canBank: true,
    capacity: 100,
    location: 'Salem District',
    coordinates: { lat: 11.6643, lng: 78.1460 }
  },
  { 
    id: 'SITE002', 
    name: 'Namakkal', 
    type: PLANT_TYPES.SOLAR, 
    canBank: false,
    capacity: 75,
    location: 'Namakkal District',
    coordinates: { lat: 11.2342, lng: 78.1673 }
  },
  { 
    id: 'SITE003', 
    name: 'Erode', 
    type: PLANT_TYPES.WIND, 
    canBank: true,
    capacity: 120,
    location: 'Erode District',
    coordinates: { lat: 11.3410, lng: 77.7172 }
  },
  { 
    id: 'SITE004', 
    name: 'Trichy', 
    type: PLANT_TYPES.SOLAR, 
    canBank: false,
    capacity: 80,
    location: 'Tiruchirappalli District',
    coordinates: { lat: 10.7905, lng: 78.7047 }
  },
  { 
    id: 'SITE005', 
    name: 'Karur', 
    type: PLANT_TYPES.WIND, 
    canBank: true,
    capacity: 90,
    location: 'Karur District',
    coordinates: { lat: 10.9601, lng: 78.0766 }
  },
  { 
    id: 'SITE006', 
    name: 'Nalippalayam', 
    type: PLANT_TYPES.SOLAR, 
    canBank: false,
    capacity: 70,
    location: 'Coimbatore District',
    coordinates: { lat: 11.0168, lng: 77.0437 }
  },
  { 
    id: 'SITE007', 
    name: 'Coimbatore', 
    type: PLANT_TYPES.WIND, 
    canBank: true,
    capacity: 150,
    location: 'Coimbatore District',
    coordinates: { lat: 11.0168, lng: 76.9558 }
  },
  { 
    id: 'SITE008', 
    name: 'Chennai', 
    type: PLANT_TYPES.SOLAR, 
    canBank: false,
    capacity: 85,
    location: 'Chennai District',
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  { 
    id: 'SITE009', 
    name: 'Madurai', 
    type: PLANT_TYPES.WIND, 
    canBank: true,
    capacity: 110,
    location: 'Madurai District',
    coordinates: { lat: 9.9252, lng: 78.1198 }
  },
  { 
    id: 'SITE010', 
    name: 'Ooty', 
    type: PLANT_TYPES.SOLAR, 
    canBank: false,
    capacity: 60,
    location: 'Nilgiris District',
    coordinates: { lat: 11.4102, lng: 76.6950 }
  },
  { 
    id: 'SITE011', 
    name: 'Vellore', 
    type: PLANT_TYPES.WIND, 
    canBank: true,
    capacity: 95,
    location: 'Vellore District',
    coordinates: { lat: 12.9165, lng: 79.1325 }
  },
  { 
    id: 'SITE012', 
    name: 'Cuddalore', 
    type: PLANT_TYPES.SOLAR, 
    canBank: false,
    capacity: 65,
    location: 'Cuddalore District',
    coordinates: { lat: 11.7480, lng: 79.7714 }
  }
];

export const getPlantTypeDetails = (type) => {
  switch (type) {
    case PLANT_TYPES.WIND:
      return {
        name: 'Wind Power',
        icon: 'wind',
        color: '#4CAF50',
        timeSlots: TIME_SLOTS[PLANT_TYPES.WIND],
        description: 'Wind power generation with peak and non-peak time slots',
        peakHours: '06:00-10:00, 14:00-22:00',
        nonPeakHours: '10:00-14:00, 22:00-06:00'
      };
    case PLANT_TYPES.SOLAR:
      return {
        name: 'Solar Power',
        icon: 'sun',
        color: '#FF9800',
        timeSlots: TIME_SLOTS[PLANT_TYPES.SOLAR],
        description: 'Solar power generation with morning, afternoon, and evening slots',
        peakHours: '06:00-17:00',
        nonPeakHours: '17:00-19:00'
      };
    default:
      throw new Error(`Invalid plant type: ${type}`);
  }
};

export const getSitesByType = (type) => {
  return SITES.filter(site => site.type === type);
};

export const getSiteById = (siteId) => {
  return SITES.find(site => site.id === siteId);
};
