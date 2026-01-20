# NexHire - Quick Start Guide

This is a condensed version of the setup guide. For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## ⚡ Quick Setup (15 minutes)

### 1. Prerequisites Check
```bash
node --version  # Need v18+
npm --version
git --version
docker --version  # Optional but recommended
```

### 2. Start Infrastructure (Kafka + Redis)

#### Option A: Using Docker (Recommended)
```bash
cd job-portal
docker-compose -f docker-compose.infrastructure.yml up -d
```

#### Option B: Manual Setup
- Install and start Redis
- Install and start Kafka (with Zookeeper)

### 3. Set Up External Services (5 minutes)

Create accounts and get API keys:
- ✅ **Neon Database**: https://neon.tech → Get connection string
- ✅ **Cloudinary**: https://cloudinary.com → Get Cloud Name, API Key, Secret
- ✅ **Google Gemini**: https://aistudio.google.com → Get API Key
- ✅ **Razorpay**: https://razorpay.com → Get Key ID, Secret (Test mode is fine)
- ✅ **Gmail**: Enable App Password for SMTP

### 4. Configure Environment Variables

Create `.env` files in each service:

**`services/auth/.env`**
```env
PORT=5000
DB_URL=your-neon-connection-string
Redis_url=redis://localhost:6379
JWT_SEC=your-super-secret-jwt-key-min-32-chars
Kafka_Broker=localhost:9092
UPLOAD_SERVICE=http://localhost:5001
Frontend_Url=http://localhost:3000
```

**`services/user/.env`**
```env
PORT=5002
DB_URL=your-neon-connection-string
JWT_SEC=same-as-auth-service
UPLOAD_SERVICE=http://localhost:5001
```

**`services/job/.env`**
```env
PORT=5003
DB_URL=your-neon-connection-string
JWT_SEC=same-as-auth-service
Kafka_Broker=localhost:9092
UPLOAD_SERVICE=http://localhost:5001
```

**`services/payment/.env`**
```env
PORT=5004
DB_URL=your-neon-connection-string
JWT_SEC=same-as-auth-service
Razorpay_Key=your-key-id
Razorpay_Secret=your-secret
```

**`services/utils/.env`**
```env
PORT=5001
Kafka_Broker=localhost:9092
CLOUD_NAME=your-cloud-name
API_KEY=your-cloudinary-key
API_SECRET=your-cloudinary-secret
API_KEY_GEMINI=your-gemini-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5. Install & Start Services

#### Terminal 1: Utils Service
```bash
cd services/utils
npm install && npm run build && npm start
```

#### Terminal 2: Auth Service
```bash
cd services/auth
npm install && npm run build && npm start
```

#### Terminal 3: User Service
```bash
cd services/user
npm install && npm run build && npm start
```

#### Terminal 4: Job Service
```bash
cd services/job
npm install && npm run build && npm start
```

#### Terminal 5: Payment Service
```bash
cd services/payment
npm install && npm run build && npm start
```

#### Terminal 6: Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6. Verify Everything Works

1. **Check all services are running:**
   - Utils: http://localhost:5001
   - Auth: http://localhost:5000
   - User: http://localhost:5002
   - Job: http://localhost:5003
   - Payment: http://localhost:5004
   - Frontend: http://localhost:3000

2. **Test the app:**
   - Open http://localhost:3000
   - Register a new account
   - Login
   - Try posting a job (recruiter) or applying (jobseeker)

## 🎯 Service Start Order

**Important:** Start services in this exact order:

1. ✅ **Infrastructure**: Kafka + Redis
2. ✅ **Utils Service** (creates Kafka topics)
3. ✅ **Auth Service** (creates user tables)
4. ✅ **Job Service** (creates job tables)
5. ✅ **User Service**
6. ✅ **Payment Service**
7. ✅ **Frontend**

## 🛠️ Development Mode

For auto-reload during development, use `npm run dev` instead of `npm start`:

```bash
npm run dev  # Auto-reloads on file changes
```

## 📝 Common Commands

```bash
# Start infrastructure
docker-compose -f docker-compose.infrastructure.yml up -d

# Stop infrastructure
docker-compose -f docker-compose.infrastructure.yml down

# Check Kafka topics
docker exec nexhire-kafka kafka-topics --list --bootstrap-server localhost:9092

# Test Redis connection
docker exec nexhire-redis redis-cli ping

# View logs (for Docker services)
docker-compose -f docker-compose.infrastructure.yml logs -f
```

## ⚠️ Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Port in use | Change PORT in `.env` or kill process using port |
| Kafka connection failed | Ensure Zookeeper is running first |
| Database error | Check DB_URL format and SSL mode |
| JWT errors | Ensure JWT_SEC is **identical** in all services |
| Email not sending | Check Gmail App Password and Kafka consumer |

## 📚 Need More Help?

- See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
- Check service logs for specific error messages
- Verify all environment variables are set correctly

---

**Ready to code!** 🚀
