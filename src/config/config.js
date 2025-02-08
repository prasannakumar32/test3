require('dotenv').config();

const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-west-2',
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
  dynamodb: {
    tableNames: {
      productionSites: process.env.PRODUCTION_SITES_TABLE || 'ProductionSites',
      consumptionSites: process.env.CONSUMPTION_SITES_TABLE || 'ConsumptionSites',
    },
  },
};

export default config;
