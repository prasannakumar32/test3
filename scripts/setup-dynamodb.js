const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  CreateTableCommand,
  PutCommand
} = require('@aws-sdk/lib-dynamodb');

// Configure DynamoDB client
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

const sampleProductionData = [
  {
    CompanyId: 1,
    ProductionId: 1,
    Month: 'January',
    Year: 2024,
    C1: 150,
    C2: 160,
    C3: 155,
    C4: 145,
    C5: 158
  },
  {
    CompanyId: 1,
    ProductionId: 1,
    Month: 'February',
    Year: 2024,
    C1: 145,
    C2: 155,
    C3: 150,
    C4: 140,
    C5: 152
  },
  {
    CompanyId: 1,
    ProductionId: 2,
    Month: 'January',
    Year: 2024,
    C1: 90,
    C2: 95,
    C3: 92,
    C4: 88,
    C5: 93
  },
  {
    CompanyId: 1,
    ProductionId: 2,
    Month: 'February',
    Year: 2024,
    C1: 85,
    C2: 90,
    C3: 88,
    C4: 86,
    C5: 89
  }
];

async function createTable(tableDefinition) {
  try {
    const command = new CreateTableCommand(tableDefinition);
    await docClient.send(command);
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
      console.log(`Added item to ${tableName}: ${item.Name || item.Month}`);
    } catch (err) {
      console.error(`Error adding item to ${tableName}:`, err);
      throw err;
    }
  }
}

async function setupTables() {
  try {
    // Create tables
    await Promise.all(Object.values(tables).map(createTable));

    // Wait for tables to be active
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Insert sample data
    await insertData('ProductionUnitTable', sampleProductionUnits);
    await insertData('ProductionTable', sampleProductionData);

    console.log('Setup complete!');
  } catch (err) {
    console.error('Error during setup:', err);
  }
}

setupTables();
