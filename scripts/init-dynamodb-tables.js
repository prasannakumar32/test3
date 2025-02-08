const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient,
  PutCommand
} = require('@aws-sdk/lib-dynamodb');

// Configure DynamoDB client for local
const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
  }
});

const docClient = DynamoDBDocumentClient.from(client);

// Table definitions
const tables = {
  ProductionUnitTable: {
    TableName: 'ProductionUnitTable',
    KeySchema: [
      { AttributeName: 'CompanyId', KeyType: 'HASH' },
      { AttributeName: 'ProductionId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'CompanyId', AttributeType: 'N' },
      { AttributeName: 'ProductionId', AttributeType: 'N' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  },
  ProductionTable: {
    TableName: 'ProductionTable',
    KeySchema: [
      { AttributeName: 'CompanyId', KeyType: 'HASH' },
      { AttributeName: 'ProductionId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'CompanyId', AttributeType: 'N' },
      { AttributeName: 'ProductionId', AttributeType: 'N' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  }
};

// Sample data
const sampleProductionUnits = [
  {
    CompanyId: 1,
    ProductionId: 1,
    Name: 'Tirunelveli Wind Farm',
    Location: 'Tirunelveli, Tamil Nadu',
    Type: 'Wind',
    Status: 'Active',
    Capacity_MW: 1000,
    Annual_Production_L: 876000,
    HTSC_No: '069053446009',
    Injection_Voltage: 230
  },
  {
    CompanyId: 1,
    ProductionId: 2,
    Name: 'Pudukottai Solar Park',
    Location: 'Pudukottai, Tamil Nadu',
    Type: 'Solar',
    Status: 'Active',
    Capacity_MW: 600,
    Annual_Production_L: 525600,
    HTSC_No: 'TNL-001',
    Injection_Voltage: 110
  }
];

const months = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

// Generate sample production data for each month
const sampleProductionData = [];
[2024, 2025].forEach(year => {
  sampleProductionUnits.forEach(unit => {
    months.forEach(month => {
      // Generate random production values between 80-100% of capacity
      const baseValue = unit.Capacity_MW * 0.8;
      const randomFactor = () => 1 + (Math.random() * 0.2); // Random factor between 1.0-1.2

      sampleProductionData.push({
        CompanyId: unit.CompanyId,
        ProductionId: unit.ProductionId,
        Month: month,
        Year: year,
        C1: Math.round(baseValue * randomFactor() * 10) / 10,
        C2: Math.round(baseValue * randomFactor() * 10) / 10,
        C3: Math.round(baseValue * randomFactor() * 10) / 10,
        C4: Math.round(baseValue * randomFactor() * 10) / 10,
        C5: Math.round(baseValue * randomFactor() * 10) / 10
      });
    });
  });
});

async function createTable(tableDefinition) {
  try {
    const command = new CreateTableCommand(tableDefinition);
    await client.send(command); // Use client instead of docClient for table creation
    console.log(`Created table: ${tableDefinition.TableName}`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Table already exists: ${tableDefinition.TableName}`);
    } else {
      throw err;
    }
  }
}

async function insertData(tableName, items) {
  for (const item of items) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: item
      });
      await docClient.send(command);
      console.log(`Added item to ${tableName}: ${item.Name || (item.Month + ' ' + item.Year)}`);
    } catch (err) {
      console.error(`Error adding item to ${tableName}:`, err);
      throw err;
    }
  }
}

async function initializeTables() {
  try {
    // Create tables
    console.log('Creating tables...');
    await Promise.all(Object.values(tables).map(createTable));

    // Wait for tables to be active
    console.log('Waiting for tables to be active...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Insert sample data
    console.log('Inserting sample data...');
    await insertData('ProductionUnitTable', sampleProductionUnits);
    await insertData('ProductionTable', sampleProductionData);

    console.log('Database initialization complete!');
  } catch (err) {
    console.error('Error during initialization:', err);
    process.exit(1);
  }
}

// Run initialization
initializeTables();
