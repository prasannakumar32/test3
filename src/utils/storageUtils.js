import AWS from 'aws-sdk';
import config from '../config/config';

// Configure AWS
AWS.config.update({
  region: config.aws.region,
  endpoint: config.aws.endpoint,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const getDefaultValues = () => ({
  monthlyProduction: 0,
  monthlyCost: 0,
  monthlyRevenue: 0,
});

export const getProductionSiteData = async () => {
  try {
    const params = {
      TableName: config.dynamodb.tableNames.productionSites,
    };
    const result = await dynamoDB.scan(params).promise();
    return result.Items.reduce((acc, item) => {
      acc[item.siteId] = item;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching production sites:', error);
    return {};
  }
};

export const getConsumptionSiteData = async () => {
  try {
    const params = {
      TableName: config.dynamodb.tableNames.consumptionSites,
    };
    const result = await dynamoDB.scan(params).promise();
    return result.Items.reduce((acc, item) => {
      acc[item.siteId] = item;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching consumption sites:', error);
    return {};
  }
};

export const updateSiteMonthlyData = async (siteId, isProduction, monthlyData) => {
  try {
    const params = {
      TableName: isProduction 
        ? config.dynamodb.tableNames.productionSites 
        : config.dynamodb.tableNames.consumptionSites,
      Key: { siteId },
      UpdateExpression: 'set monthlyData = :monthlyData',
      ExpressionAttributeValues: {
        ':monthlyData': monthlyData,
      },
      ReturnValues: 'ALL_NEW',
    };
    
    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error updating site data:', error);
    throw error;
  }
};
