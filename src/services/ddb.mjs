import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000"
});
const docClient = DynamoDBDocumentClient.from(client);

export function getAllItems() {
  paginatedScan("ProductionUnitTable").catch((err) => {
    console.error(err);
  });
}

async function paginatedScan(tableName) {
  let lastEvaluatedKey;
  let pageCount = 0;

  do {
    const params = {
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const response = await client.send(new ScanCommand(params));
    pageCount++;
    console.log(`Page ${pageCount}, Items:`, response.Items);
    response.Items.forEach((item) => {
      console.log("Item :", JSON.stringify(item));
    });
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);
}
export default getAllItems;
getAllItems();
console.log("Getting all items from the table...");