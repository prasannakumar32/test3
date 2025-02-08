# Stop any existing Java processes
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force

# Change to the DynamoDB Local directory
Set-Location -Path "$PSScriptRoot\..\dynamodb_local"

# Create CORS configuration file
$corsConfig = @{
    CORSRules = @(
        @{
            AllowedOrigins = @("*")
            AllowedHeaders = @("*")
            AllowedMethods = @("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
            ExposeHeaders = @("x-amz-server-side-encryption",
                            "x-amz-request-id",
                            "x-amz-id-2",
                            "ETag")
            MaxAgeSeconds = 3000
        }
    )
} | ConvertTo-Json -Depth 10

Set-Content -Path "cors-config.json" -Value $corsConfig -Encoding UTF8

# Wait for any existing processes to fully terminate
Start-Sleep -Seconds 2

# Start DynamoDB Local with enhanced configuration
$process = Start-Process -FilePath "java" -ArgumentList @(
    "-Djava.library.path=./DynamoDBLocal_lib",
    "-jar", "DynamoDBLocal.jar",
    "-sharedDb",
    "-cors", "*",
    "-dbPath", ".",
    "-port", "8000"
) -NoNewWindow -PassThru

# Wait for DynamoDB to start
Write-Host "Waiting for DynamoDB Local to start..."
Start-Sleep -Seconds 10

# Test if DynamoDB is responding
$maxRetries = 5
$retryCount = 0
$success = $false

while (-not $success -and $retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000" -Method OPTIONS -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $success = $true
            Write-Host "DynamoDB Local is running successfully!"
        }
    }
    catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "Waiting for DynamoDB to be ready... (Attempt $retryCount of $maxRetries)"
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $success) {
    Write-Host "Warning: Could not verify DynamoDB Local is running, but continuing anyway..."
}

# Initialize tables
Set-Location -Path "$PSScriptRoot\.."
Write-Host "Initializing tables..."
node scripts/init-dynamodb-tables.js

Write-Host "DynamoDB Local is running with PID: $($process.Id)"
