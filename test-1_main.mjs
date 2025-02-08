import { putItem, getItem, deleteItem, getAllItems, processJsonData } from './DynamoDBLocalUtils_v3_crud.mjs';

// Example JSON data structure
const jsonData = {
    ModelName: "Local_Dev_Test",
    ModelMetadata: {
        Author: "Strio",
        DateCreated: "Jan 21, 2025, 06:45 AM",
        DateLastModified: "Jan 25, 2025, 08:28 AM",
        Description: "",
        AWSService: "Amazon DynamoDB",
        Version: "3.0"
    },
    DataModel: [
        {
            TableName: "ProductionUnitTable",
            KeyAttributes: {
                PartitionKey: { AttributeName: "CompanyId", AttributeType: "N" },
                SortKey: { AttributeName: "ProductionId", AttributeType: "N" }
            },
            TableData: [
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
            ]
        },
        {
            TableName: "ProductionTable",
            KeyAttributes: {
                PartitionKey: { AttributeName: "CompanyId", AttributeType: "N" },
                SortKey: { AttributeName: "ProductionId", AttributeType: "N" }
            },
            TableData: [
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
        }
    ]
};

async function initializeDatabase() {
    try {
        console.log('Initializing database with data:', jsonData);
        await processJsonData(jsonData);
        console.log('Database initialized successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Call the initialization function
initializeDatabase();
