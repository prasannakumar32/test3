import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';

const config = {
  endpoint: 'http://localhost:8000',
  region: 'local',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  },
  maxAttempts: 3,
  requestTimeout: 5000,
  httpOptions: {
    timeout: 5000,
    connectTimeout: 5000,
    keepAlive: true,
    poolSize: 50
  }
};

const marshallOptions = {
  convertEmptyValues: true,
  removeUndefinedValues: true,
  convertClassInstanceToMap: true
};

const unmarshallOptions = {
  wrapNumbers: false
};

const translateConfig = { marshallOptions, unmarshallOptions };

let clientPool = [];
const POOL_SIZE = 1;

for (let i = 0; i < POOL_SIZE; i++) {
  const client = new DynamoDBClient(config);
  clientPool.push(DynamoDBDocumentClient.from(client, translateConfig));
}

let currentClientIndex = 0;

const getClient = () => {
  const client = clientPool[currentClientIndex];
  currentClientIndex = (currentClientIndex + 1) % POOL_SIZE;
  return client;
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async (operation, maxRetries = 2, initialDelay = 500) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error;

      if (i < maxRetries - 1) {
        await delay(initialDelay * Math.pow(1.5, i));
      }
    }
  }

  throw lastError;
};

const PRODUCTION_UNIT_TABLE = 'ProductionUnitTable';
const PRODUCTION_TABLE = 'ProductionTable';

// Function to get all production units
export const getAllProductionUnits = async () => {
  try {
    const command = new ScanCommand({
      TableName: PRODUCTION_UNIT_TABLE,
      ConsistentRead: false, // Use eventually consistent reads for better performance
    });

    const result = await retryOperation(async () => {
      return await getClient().send(command);
    });

    return result.Items || [];
  } catch (error) {
    console.error('Error in getAllProductionUnits:', error);
    throw new Error('Failed to fetch production units: ' + error.message);
  }
};

// Function to get production unit
export const getProductionUnit = async (companyId, productionId) => {
  try {
    const command = new GetCommand({
      TableName: PRODUCTION_UNIT_TABLE,
      Key: {
        CompanyId: parseInt(companyId),
        ProductionId: parseInt(productionId)
      }
    });

    const result = await retryOperation(async () => {
      return await getClient().send(command);
    });

    return result.Item;
  } catch (error) {
    console.error('Error in getProductionUnit:', error);
    throw new Error('Failed to fetch production unit: ' + error.message);
  }
};

// Function to get production data for a specific unit
export const getProductionData = async (companyId, productionId) => {
  try {
    const command = new QueryCommand({
      TableName: PRODUCTION_TABLE,
      KeyConditionExpression: 'CompanyId = :companyId AND ProductionId = :productionId',
      ExpressionAttributeValues: {
        ':companyId': parseInt(companyId),
        ':productionId': parseInt(productionId)
      }
    });

    const result = await retryOperation(async () => {
      return await getClient().send(command);
    });

    return result.Items || [];
  } catch (error) {
    console.error('Error in getProductionData:', error);
    throw new Error('Failed to fetch production data: ' + error.message);
  }
};

// Function to get production data by month
export const getProductionDataByMonth = async (companyId, productionId, month, year) => {
  try {
    const command = new QueryCommand({
      TableName: PRODUCTION_TABLE,
      KeyConditionExpression: 'CompanyId = :companyId AND ProductionId = :productionId',
      FilterExpression: 'Month = :month AND Year = :year',
      ExpressionAttributeValues: {
        ':companyId': parseInt(companyId),
        ':productionId': parseInt(productionId),
        ':month': month,
        ':year': parseInt(year)
      }
    });

    const result = await retryOperation(async () => {
      return await getClient().send(command);
    });

    return result.Items?.[0] || null;
  } catch (error) {
    console.error('Error in getProductionDataByMonth:', error);
    throw new Error('Failed to fetch production data by month: ' + error.message);
  }
};

// Function to add or update production unit
export const updateProductionUnit = async (unit) => {
  try {
    const command = new PutCommand({
      TableName: PRODUCTION_UNIT_TABLE,
      Item: {
        CompanyId: parseInt(unit.CompanyId),
        ProductionId: parseInt(unit.ProductionId),
        Name: unit.Name,
        Location: unit.Location,
        Type: unit.Type,
        Status: unit.Status,
        Capacity_MW: parseFloat(unit.Capacity_MW),
        Annual_Production_L: parseFloat(unit.Annual_Production_L),
        HTSC_No: unit.HTSC_No,
        Injection_Voltage: unit.Injection_Voltage
      }
    });

    await retryOperation(async () => {
      return await getClient().send(command);
    });
  } catch (error) {
    console.error('Error in updateProductionUnit:', error);
    throw new Error('Failed to update production unit: ' + error.message);
  }
};

// Function to add or update production data
export const updateProductionData = async (data) => {
  try {
    const command = new PutCommand({
      TableName: PRODUCTION_TABLE,
      Item: {
        CompanyId: parseInt(data.CompanyId),
        ProductionId: parseInt(data.ProductionId),
        Month: data.Month,
        Year: parseInt(data.Year),
        C1: parseFloat(data.C1 || 0),
        C2: parseFloat(data.C2 || 0),
        C3: parseFloat(data.C3 || 0),
        C4: parseFloat(data.C4 || 0),
        C5: parseFloat(data.C5 || 0)
      }
    });

    await retryOperation(async () => {
      return await getClient().send(command);
    });
  } catch (error) {
    console.error('Error in updateProductionData:', error);
    throw new Error('Failed to update production data: ' + error.message);
  }
};

// Function to delete production data
export const deleteProductionData = async (companyId, productionId, month, year) => {
  try {
    const command = new DeleteCommand({
      TableName: PRODUCTION_TABLE,
      Key: {
        CompanyId: parseInt(companyId),
        ProductionId: parseInt(productionId)
      },
      ConditionExpression: 'Month = :month AND Year = :year',
      ExpressionAttributeValues: {
        ':month': month,
        ':year': parseInt(year)
      }
    });

    await retryOperation(async () => {
      return await getClient().send(command);
    });
  } catch (error) {
    console.error('Error in deleteProductionData:', error);
    throw new Error('Failed to delete production data: ' + error.message);
  }
};

// Function to retrieve total sites and total capacity from DynamoDB
export const getTotalSitesAndCapacity = async () => {
  try {
    console.log('Fetching total sites and capacity from DynamoDB...');
    const command = new ScanCommand({
      TableName: 'ProductionUnitTable',
    });

    const result = await retryOperation(async () => {
      return await getClient().send(command);
    });

    console.log('DynamoDB response:', result);
    const totalSites = result.Items.length;
    const totalCapacity = result.Items.reduce((sum, item) => sum + parseFloat(item.Capacity_MW), 0);
    console.log(`Total Sites: ${totalSites}, Total Capacity: ${totalCapacity}`);
    return { totalSites, totalCapacity };
  } catch (error) {
    console.error('Error in getTotalSitesAndCapacity:', error);
    throw new Error('Failed to fetch total sites and capacity: ' + error.message + '. Ensure DynamoDB is running and the table name is correct.');
  }
};

