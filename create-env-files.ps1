# PowerShell script to create all .env files for NexHire services
# Run this script after adding your credentials below

Write-Host "Creating .env files for all services..." -ForegroundColor Green

# ============================================
# ADD YOUR CREDENTIALS HERE
# ============================================

# Your existing values (already configured)
$PORT_AUTH = "5000"
$DB_URL = "postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
$JWT_SEC = "kfdlsajeroifwahneflk"
$KAFKA_BROKER = "localhost:9092"
$UPLOAD_SERVICE = "http://localhost:5001"
$FRONTEND_URL = "http://localhost:3000"
$REDIS_URL = "redis://localhost:6379"

# ADD YOUR CREDENTIALS BELOW:
$RAZORPAY_KEY = "YOUR_RAZORPAY_KEY_HERE"
$RAZORPAY_SECRET = "YOUR_RAZORPAY_SECRET_HERE"
$CLOUD_NAME = "YOUR_CLOUDINARY_CLOUD_NAME_HERE"
$CLOUDINARY_API_KEY = "YOUR_CLOUDINARY_API_KEY_HERE"
$CLOUDINARY_API_SECRET = "YOUR_CLOUDINARY_API_SECRET_HERE"
$GEMINI_API_KEY = "YOUR_GOOGLE_GEMINI_API_KEY_HERE"
$SMTP_USER = "YOUR_EMAIL@gmail.com"
$SMTP_PASS = "YOUR_16_CHARACTER_APP_PASSWORD_HERE"

# ============================================
# Creating .env files
# ============================================

# Auth Service .env
Write-Host "Creating services/auth/.env..." -ForegroundColor Yellow
$authEnv = @"
PORT=$PORT_AUTH
DB_URL=$DB_URL
UPLOAD_SERVICE=$UPLOAD_SERVICE
JWT_SEC=$JWT_SEC
Kafka_Broker=$KAFKA_BROKER
Frontend_Url=$FRONTEND_URL
Redis_url=$REDIS_URL
"@
$authEnv | Out-File -FilePath "services\auth\.env" -Encoding utf8 -NoNewline

# User Service .env
Write-Host "Creating services/user/.env..." -ForegroundColor Yellow
$userEnv = @"
PORT=5002
DB_URL=$DB_URL
JWT_SEC=$JWT_SEC
UPLOAD_SERVICE=$UPLOAD_SERVICE
"@
$userEnv | Out-File -FilePath "services\user\.env" -Encoding utf8 -NoNewline

# Job Service .env
Write-Host "Creating services/job/.env..." -ForegroundColor Yellow
$jobEnv = @"
PORT=5003
DB_URL=$DB_URL
JWT_SEC=$JWT_SEC
Kafka_Broker=$KAFKA_BROKER
UPLOAD_SERVICE=$UPLOAD_SERVICE
"@
$jobEnv | Out-File -FilePath "services\job\.env" -Encoding utf8 -NoNewline

# Payment Service .env
Write-Host "Creating services/payment/.env..." -ForegroundColor Yellow
$paymentEnv = @"
PORT=5004
DB_URL=$DB_URL
JWT_SEC=$JWT_SEC
Razorpay_Key=$RAZORPAY_KEY
Razorpay_Secret=$RAZORPAY_SECRET
"@
$paymentEnv | Out-File -FilePath "services\payment\.env" -Encoding utf8 -NoNewline

# Utils Service .env
Write-Host "Creating services/utils/.env..." -ForegroundColor Yellow
$utilsEnv = @"
PORT=5001
Kafka_Broker=$KAFKA_BROKER
CLOUD_NAME=$CLOUD_NAME
API_KEY=$CLOUDINARY_API_KEY
API_SECRET=$CLOUDINARY_API_SECRET
API_KEY_GEMINI=$GEMINI_API_KEY
SMTP_USER=$SMTP_USER
SMTP_PASS=$SMTP_PASS
"@
$utilsEnv | Out-File -FilePath "services\utils\.env" -Encoding utf8 -NoNewline

# Frontend .env.local (optional)
Write-Host "Creating frontend/.env.local..." -ForegroundColor Yellow
$frontendEnv = @"
NEXT_PUBLIC_UTILS_SERVICE=http://localhost:5001
NEXT_PUBLIC_AUTH_SERVICE=http://localhost:5000
NEXT_PUBLIC_USER_SERVICE=http://localhost:5002
NEXT_PUBLIC_JOB_SERVICE=http://localhost:5003
NEXT_PUBLIC_PAYMENT_SERVICE=http://localhost:5004
"@
$frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding utf8 -NoNewline

Write-Host "`n✅ All .env files created successfully!" -ForegroundColor Green
Write-Host "`n⚠️  Remember to replace placeholder values with your actual credentials!" -ForegroundColor Yellow
Write-Host "   Edit this script and replace all 'YOUR_*_HERE' values with your actual keys." -ForegroundColor Yellow
