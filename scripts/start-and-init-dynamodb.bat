@echo off
echo Starting DynamoDB Local and initializing tables...

REM Kill any existing Java processes running DynamoDB Local
taskkill /F /IM java.exe 2>NUL

REM Create a CORS configuration file if it doesn't exist
echo { > dynamodb_local\cors-config.json
echo   "CORSRules": [ >> dynamodb_local\cors-config.json
echo     { >> dynamodb_local\cors-config.json
echo       "AllowedOrigins": ["*"], >> dynamodb_local\cors-config.json
echo       "AllowedHeaders": ["*"], >> dynamodb_local\cors-config.json
echo       "AllowedMethods": ["GET", "POST", "PUT", "DELETE"], >> dynamodb_local\cors-config.json
echo       "MaxAgeSeconds": 3000 >> dynamodb_local\cors-config.json
echo     } >> dynamodb_local\cors-config.json
echo   ] >> dynamodb_local\cors-config.json
echo } >> dynamodb_local\cors-config.json

REM Start DynamoDB Local with CORS enabled
cd dynamodb_local
start /B java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -cors * -dbPath . -corsConfiguration cors-config.json

REM Wait for DynamoDB to start
timeout /t 5 /nobreak > nul

cd ..
node scripts/init-dynamodb-tables.js

echo Setup complete! DynamoDB Local is running in the background.
