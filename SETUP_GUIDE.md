# NexHire - Complete Setup Guide

This guide will walk you through setting up and running the NexHire job portal project step by step.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [External Services Setup](#external-services-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Kafka Setup](#kafka-setup)
6. [Running the Services](#running-the-services)
7. [Running the Frontend](#running-the-frontend)
8. [Testing the Application](#testing-the-application)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Install the following on your system:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Kafka** (for message queue) - [Download](https://kafka.apache.org/downloads)
- **Redis** (for caching) - [Download](https://redis.io/download)
- **Docker** (optional, for containerized services) - [Download](https://www.docker.com/)

### Verify Installation
```bash
node --version    # Should be v18+
npm --version
git --version
java -version    # Required for Kafka
```

---

## 🌐 External Services Setup

You'll need accounts and API keys from the following services:

### 1. **Neon Database (PostgreSQL)**
1. Go to [Neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy your database connection string (you'll need this later)

### 2. **Cloudinary (File Storage)**
1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard → Settings
4. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. **Google Gemini AI**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Get an API key (click "Get API Key")
4. Copy the API key

### 4. **Razorpay (Payment Gateway)**
1. Go to [Razorpay.com](https://razorpay.com)
2. Sign up for a merchant account
3. Go to Settings → API Keys
4. Generate Test/Live keys
5. Copy:
   - Key ID
   - Key Secret

### 5. **Gmail SMTP (Email Service)**
1. Use your Gmail account
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate a new app password for "Mail"
   - Copy the generated password (16 characters)

### 6. **Redis**
#### Option A: Local Installation
- Install Redis locally on your machine
- Default URL: `redis://localhost:6379`

#### Option B: Redis Cloud (Free)
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Sign up for free account
3. Create a free database
4. Copy the connection URL

---

## 📝 Environment Variables

Create `.env` files in each service directory with the following variables:

### 🔐 Auth Service (`job-portal/services/auth/.env`)
```env
# Server Configuration
PORT=5000

# Database (Neon PostgreSQL)
DB_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# Redis
Redis_url=redis://localhost:6379

# JWT Secret (generate a strong random string)
JWT_SEC=your-super-secret-jwt-key-here-min-32-characters

# Kafka
Kafka_Broker=localhost:9092

# Upload Service (Utils Service URL)
UPLOAD_SERVICE=http://localhost:5001

# Frontend URL
Frontend_Url=http://localhost:3000
```

### 👤 User Service (`job-portal/services/user/.env`)
```env
# Server Configuration
PORT=5002

# Database (Neon PostgreSQL - can be same or different)
DB_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# JWT Secret (must match Auth Service)
JWT_SEC=your-super-secret-jwt-key-here-min-32-characters

# Upload Service (Utils Service URL)
UPLOAD_SERVICE=http://localhost:5001
```

### 💼 Job Service (`job-portal/services/job/.env`)
```env
# Server Configuration
PORT=5003

# Database (Neon PostgreSQL - can be same or different)
DB_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# JWT Secret (must match Auth Service)
JWT_SEC=your-super-secret-jwt-key-here-min-32-characters

# Kafka
Kafka_Broker=localhost:9092

# Upload Service (Utils Service URL)
UPLOAD_SERVICE=http://localhost:5001
```

### 💳 Payment Service (`job-portal/services/payment/.env`)
```env
# Server Configuration
PORT=5004

# Database (Neon PostgreSQL - can be same or different)
DB_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# JWT Secret (must match Auth Service)
JWT_SEC=your-super-secret-jwt-key-here-min-32-characters

# Razorpay
Razorpay_Key=your-razorpay-key-id
Razorpay_Secret=your-razorpay-key-secret
```

### 🛠️ Utils Service (`job-portal/services/utils/.env`)
```env
# Server Configuration
PORT=5001

# Kafka
Kafka_Broker=localhost:9092

# Cloudinary
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# Google Gemini AI
API_KEY_GEMINI=your-google-gemini-api-key

# Gmail SMTP
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

### 🎨 Frontend (`job-portal/frontend/.env.local`)
```env
# Service URLs (Update these to match your service ports)
NEXT_PUBLIC_UTILS_SERVICE=http://localhost:5001
NEXT_PUBLIC_AUTH_SERVICE=http://localhost:5000
NEXT_PUBLIC_USER_SERVICE=http://localhost:5002
NEXT_PUBLIC_JOB_SERVICE=http://localhost:5003
NEXT_PUBLIC_PAYMENT_SERVICE=http://localhost:5004
```

**Note:** If you're using the hardcoded IP addresses in `AppContext.tsx`, you may need to update those or use environment variables instead.

---

## 🗄️ Database Setup

The services automatically create database tables on startup. However, if you want to use separate databases for each service:

### Option 1: Single Database (Recommended for Development)
- All services use the same Neon database
- Tables are namespaced by service (users, jobs, applications, etc.)
- Simpler to manage

### Option 2: Separate Databases
- Each service has its own database
- More isolated, better for production
- Requires multiple Neon projects

### Database Tables Created Automatically:
- **Auth Service**: `users`, `skills`, `user_skills`
- **Job Service**: `companies`, `jobs`, `applications`
- **Payment Service**: Uses database for payment records
- **User Service**: Uses same database as Auth Service

---

## ☕ Kafka Setup

Kafka is used for asynchronous email notifications.

### Option 1: Local Installation

#### Windows (using WSL or native):
```bash
# Download Kafka from https://kafka.apache.org/downloads
# Extract the archive

# 1. Start Zookeeper (required for Kafka)
cd kafka_2.13-3.6.0
bin\windows\zookeeper-server-start.bat config\zookeeper.properties

# 2. Start Kafka (in a new terminal)
bin\windows\kafka-server-start.bat config\server.properties
```

#### macOS/Linux:
```bash
# 1. Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# 2. Start Kafka (in a new terminal)
bin/kafka-server-start.sh config/server.properties
```

### Option 2: Docker (Easier)
```bash
# Create docker-compose.yml for Kafka
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

# Run with:
docker-compose up -d
```

### Verify Kafka is Running:
```bash
# List topics (should show 'send-mail' after starting services)
kafka-topics.sh --list --bootstrap-server localhost:9092
```

---

## 🚀 Running the Services

**Important:** Start services in this order for proper initialization:

### Step 1: Start Infrastructure Services
```bash
# Terminal 1: Start Redis (if not using cloud)
redis-server

# Terminal 2: Start Kafka
# (Follow Kafka setup instructions above)
```

### Step 2: Start Backend Services

Open 5 separate terminal windows:

#### Terminal 1: Utils Service (Must start first - creates Kafka topic)
```bash
cd job-portal/services/utils
npm install
npm run build
npm start
# Should see: "Utils Service is running on http://localhost:5001"
```

#### Terminal 2: Auth Service
```bash
cd job-portal/services/auth
npm install
npm run build
npm start
# Should see: "Auth service is running on http://localhost:5000"
# Should see: "✅ connected to kafka producer"
```

#### Terminal 3: User Service
```bash
cd job-portal/services/user
npm install
npm run build
npm start
# Should see: "User service is running on http://localhost:5002"
```

#### Terminal 4: Job Service
```bash
cd job-portal/services/job
npm install
npm run build
npm start
# Should see: "Job service is running on http://localhost:5003"
```

#### Terminal 5: Payment Service
```bash
cd job-portal/services/payment
npm install
npm run build
npm start
# Should see: "Payment Service is running on 5004"
```

### Development Mode (Auto-reload)
For development with auto-reload on file changes:
```bash
# In each service directory
npm run dev
```

---

## 🎨 Running the Frontend

### Step 1: Navigate to Frontend Directory
```bash
cd job-portal/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Update Service URLs (if needed)
If you're not using environment variables, update the service URLs in:
`job-portal/frontend/src/context/AppContext.tsx`

```typescript
export const utils_service = "http://localhost:5001";
export const auth_service = "http://localhost:5000";
export const user_service = "http://localhost:5002";
export const job_service = "http://localhost:5003";
export const payment_service = "http://localhost:5004";
```

### Step 4: Start Development Server
```bash
npm run dev
```

The frontend should now be running on **http://localhost:3000**

---

## ✅ Testing the Application

### 1. **Verify All Services are Running**
Check each service is accessible:
```bash
# Test Auth Service
curl http://localhost:5000/api/auth/health

# Test User Service
curl http://localhost:5002/api/user/health

# Test Job Service
curl http://localhost:5003/api/job/health

# Test Payment Service
curl http://localhost:5004/api/payment/health

# Test Utils Service
curl http://localhost:5001/api/utils/health
```

### 2. **Create a Test Account**
1. Open http://localhost:3000
2. Click "Register"
3. Create an account (choose "jobseeker" or "recruiter")
4. Check your email for verification (if implemented)

### 3. **Test Key Features**
- ✅ User Registration/Login
- ✅ Profile Management
- ✅ Job Posting (recruiter)
- ✅ Job Application (jobseeker)
- ✅ Resume Upload & Analysis
- ✅ Career Guide
- ✅ Skills Management

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Kafka"
**Solution:**
- Ensure Zookeeper is running before Kafka
- Check `Kafka_Broker` in `.env` is correct (default: `localhost:9092`)
- Verify Kafka is listening on port 9092

### Issue: "Database connection failed"
**Solution:**
- Verify your Neon database URL is correct
- Check SSL mode is set to `require`
- Ensure database credentials are valid

### Issue: "Redis connection failed"
**Solution:**
- Verify Redis is running: `redis-cli ping` (should return `PONG`)
- Check `Redis_url` in auth service `.env`
- If using Redis Cloud, ensure URL includes password

### Issue: "JWT verification failed"
**Solution:**
- Ensure `JWT_SEC` is **identical** across all services
- JWT secret should be at least 32 characters long
- Clear cookies/token and login again

### Issue: "Port already in use"
**Solution:**
- Check which process is using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  
  # macOS/Linux
  lsof -i :5000
  ```
- Kill the process or change the PORT in `.env`

### Issue: "Cloudinary upload failed"
**Solution:**
- Verify Cloudinary credentials in utils service `.env`
- Check API key and secret are correct
- Ensure Cloudinary account is active

### Issue: "Email not sending"
**Solution:**
- Verify Gmail SMTP credentials
- Use App Password, not regular password
- Check Kafka consumer is running in Utils Service
- Check Utils Service logs for email errors

### Issue: "Gemini API error"
**Solution:**
- Verify API key is correct
- Check API key has proper permissions
- Ensure you haven't exceeded rate limits

### Issue: "Frontend can't connect to services"
**Solution:**
- Verify all backend services are running
- Check service URLs in `AppContext.tsx` or `.env.local`
- Ensure CORS is enabled in backend services (should be by default)
- Check browser console for specific errors

---

## 📚 Additional Resources

- **Kafka Documentation**: https://kafka.apache.org/documentation/
- **Neon Database Docs**: https://neon.tech/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Express.js Documentation**: https://expressjs.com/

---

## 🎯 Quick Start Checklist

- [ ] Installed Node.js, Kafka, Redis
- [ ] Set up Neon Database account
- [ ] Set up Cloudinary account
- [ ] Got Google Gemini API key
- [ ] Set up Razorpay account
- [ ] Configured Gmail App Password
- [ ] Created `.env` files for all services
- [ ] Started Redis
- [ ] Started Kafka (with Zookeeper)
- [ ] Started Utils Service (port 5001)
- [ ] Started Auth Service (port 5000)
- [ ] Started User Service (port 5002)
- [ ] Started Job Service (port 5003)
- [ ] Started Payment Service (port 5004)
- [ ] Started Frontend (port 3000)
- [ ] Tested registration/login

---

## 💡 Tips for Development

1. **Use separate terminals** for each service to see logs clearly
2. **Keep Kafka and Redis running** in background terminals
3. **Check service logs** when debugging issues
4. **Use Postman/Insomnia** to test API endpoints directly
5. **Clear browser cache** if frontend changes don't reflect
6. **Use Docker Compose** for easier Kafka/Redis setup

---

Good luck with your NexHire project! 🚀
