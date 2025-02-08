@echo off
echo Setting up DynamoDB Local...

REM Create directory if it doesn't exist
if not exist "dynamodb_local" mkdir dynamodb_local
cd dynamodb_local

REM Download DynamoDB Local
curl -o dynamodb_local_latest.zip https://s3.ap-south-1.amazonaws.com/dynamodb-local-mumbai/dynamodb_local_latest.zip

REM Extract the zip file
powershell -command "Expand-Archive -Path dynamodb_local_latest.zip -DestinationPath . -Force"

REM Clean up
del dynamodb_local_latest.zip

echo DynamoDB Local setup complete!
