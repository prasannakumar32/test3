const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();

const tables = [
  {
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
  {
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
];

// Sample data
const sampleData = {
  ProductionUnitTable: [
    {
      CompanyId: { N: "1" },
      ProductionId: { N: "1" },
      Name: { S: "Star_Radhapuram_600KW" },
      Location: { S: "Tirunelveli, Radhapuram " },
      Type: { S: "Wind" },
      Banking: { N: "1" },
      Capacity_MW: { N: "0.6" },
      Annual_Production_L: { N: "9" },
      HTSC_No: { N: "79204721131" },
      Injection_Voltage: { N: "33" },
      Status: { S: "Active" }
    }
  ],
  ProductionTable: [
    {
      CompanyId: { N: "1" },
      ProductionId: { N: "1" },
      Year: { N: "2024" },
      Month: { N: "12" },
      C1: { N: "1" },
      C2: { N: "2" },
      C3: { N: "3" },
      C4: { N: "4" },
      C5: { N: "5" },
      C001: { N: "6" },
      C002: { N: "7" },
      C003: { N: "8" },
      C004: { N: "9" },
      C005: { N: "10" },
      C006: { N: "11" },
      C007: { N: "12" },
      C008: { N: "13" },
      C009: { N: "14" },
      C010: { N: "15" }
    }
  ]
};

async function createTables() {
  for (const tableParams of tables) {
    try {
      console.log(`Creating table: ${tableParams.TableName}`);
      await dynamodb.createTable(tableParams).promise();
      console.log(`Table ${tableParams.TableName} created successfully`);
      
      // Insert sample data
      const documentClient = new AWS.DynamoDB.DocumentClient();
      for (const item of sampleData[tableParams.TableName]) {
        await documentClient.put({
          TableName: tableParams.TableName,
          Item: AWS.DynamoDB.Converter.unmarshall(item)
        }).promise();
      }
      console.log(`Sample data inserted into ${tableParams.TableName}`);
    } catch (error) {
      if (error.code === 'ResourceInUseException') {
        console.log(`Table ${tableParams.TableName} already exists`);
      } else {
        console.error(`Error creating table ${tableParams.TableName}:`, error);
      }
    }
  }
}

createTables();
