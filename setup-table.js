const AWS = require('aws-sdk');

// Configure AWS SDK for local DynamoDB
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy'
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// Create table
const createTable = async () => {
    const params = {
        TableName: 'Production',
        KeySchema: [
            { AttributeName: 'siteName', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'siteName', AttributeType: 'S' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    try {
        await dynamodb.createTable(params).promise();
        console.log('Table created successfully');
    } catch (err) {
        if (err.code === 'ResourceInUseException') {
            console.log('Table already exists');
        } else {
            console.error('Error creating table:', err);
        }
    }
};

// Sample data
const sampleData = [
    {
        siteName: 'Site A',
        location: 'New York',
        capacity: '1000',
        charge: '500',
        unit: 'kWh'
    },
    {
        siteName: 'Site B',
        location: 'Los Angeles',
        capacity: '1500',
        charge: '750',
        unit: 'kWh'
    },
    {
        siteName: 'Site C',
        location: 'Chicago',
        capacity: '800',
        charge: '400',
        unit: 'kWh'
    }
];

// Insert sample data
const insertSampleData = async () => {
    for (const item of sampleData) {
        const params = {
            TableName: 'Production',
            Item: item
        };

        try {
            await docClient.put(params).promise();
            console.log('Added item:', item.siteName);
        } catch (err) {
            console.error('Error adding item:', err);
        }
    }
};

// Run setup
const setup = async () => {
    await createTable();
    await insertSampleData();
    console.log('Setup complete!');
};

setup();
