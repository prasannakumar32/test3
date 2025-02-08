# Create directories
New-Item -ItemType Directory -Force -Path dynamodb_local
Set-Location dynamodb_local

# Download DynamoDB Local
$url = "https://s3.ap-south-1.amazonaws.com/dynamodb-local-mumbai/dynamodb_local_latest.zip"
$output = "dynamodb_local_latest.zip"
Invoke-WebRequest -Uri $url -OutFile $output

# Extract the zip file
Expand-Archive -Path $output -DestinationPath . -Force

# Clean up
Remove-Item $output

Write-Host "DynamoDB Local setup complete!"
