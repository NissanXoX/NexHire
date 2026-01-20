# Environment Variables Setup Guide

Based on your Auth Service configuration, here are all the `.env` files you need to create.

## ⚠️ Important Notes

1. **JWT_SEC must be identical** across Auth, User, Job, and Payment services
2. **DB_URL can be the same** for all services (recommended) or different
3. Create these files manually - they are gitignored for security

---

## 📁 File: `services/auth/.env`

✅ **You already have this configured!** Just create the file with:

```env
PORT=5000
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
UPLOAD_SERVICE=http://localhost:5001
JWT_SEC=kfdlsajeroifwahneflk
Kafka_Broker=localhost:9092
Frontend_Url=http://localhost:3000
Redis_url=redis://localhost:6379
```

---

## 📁 File: `services/user/.env`

```env
PORT=5002
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
UPLOAD_SERVICE=http://localhost:5001
```

**Notes:**
- Uses the same `DB_URL` as Auth Service
- Uses the same `JWT_SEC` as Auth Service (IMPORTANT!)

---

## 📁 File: `services/job/.env`

```env
PORT=5003
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
Kafka_Broker=localhost:9092
UPLOAD_SERVICE=http://localhost:5001
```

**Notes:**
- Uses the same `DB_URL` as Auth Service
- Uses the same `JWT_SEC` as Auth Service (IMPORTANT!)
- Includes `Kafka_Broker` for async operations

---

## 📁 File: `services/payment/.env`

```env
PORT=5004
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
Razorpay_Key=your-razorpay-key-id
Razorpay_Secret=your-razorpay-key-secret
```

**Notes:**
- Uses the same `DB_URL` as Auth Service
- Uses the same `JWT_SEC` as Auth Service (IMPORTANT!)
- **Replace** `Razorpay_Key` and `Razorpay_Secret` with your actual Razorpay credentials
- Get these from: https://dashboard.razorpay.com/app/keys

---

## 📁 File: `services/utils/.env`

```env
PORT=5001
Kafka_Broker=localhost:9092
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
API_KEY_GEMINI=your-google-gemini-api-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

**Notes:**
- **Replace all placeholder values** with your actual credentials:
  - `CLOUD_NAME`, `API_KEY`, `API_SECRET` → Get from https://console.cloudinary.com/settings/api-keys
  - `API_KEY_GEMINI` → Get from https://aistudio.google.com/app/apikey
  - `SMTP_USER` → Your Gmail address
  - `SMTP_PASS` → Gmail App Password (not regular password!)
    - Generate from: https://myaccount.google.com/apppasswords

---

## 📁 File: `frontend/.env.local` (Optional)

```env
NEXT_PUBLIC_UTILS_SERVICE=http://localhost:5001
NEXT_PUBLIC_AUTH_SERVICE=http://localhost:5000
NEXT_PUBLIC_USER_SERVICE=http://localhost:5002
NEXT_PUBLIC_JOB_SERVICE=http://localhost:5003
NEXT_PUBLIC_PAYMENT_SERVICE=http://localhost:5004
```

**Note:** If you don't create this file, the frontend will use hardcoded URLs in `AppContext.tsx`. Either update the hardcoded URLs or create this file.

---

## 🔧 Quick Setup Commands

Run these commands to create all `.env` files:

### Windows (PowerShell)
```powershell
# Navigate to project root
cd job-portal

# Create Auth Service .env (copy your existing content)
@"
PORT=5000
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
UPLOAD_SERVICE=http://localhost:5001
JWT_SEC=kfdlsajeroifwahneflk
Kafka_Broker=localhost:9092
Frontend_Url=http://localhost:3000
Redis_url=redis://localhost:6379
"@ | Out-File -FilePath services\auth\.env -Encoding utf8

# Create User Service .env
@"
PORT=5002
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
UPLOAD_SERVICE=http://localhost:5001
"@ | Out-File -FilePath services\user\.env -Encoding utf8

# Create Job Service .env
@"
PORT=5003
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
Kafka_Broker=localhost:9092
UPLOAD_SERVICE=http://localhost:5001
"@ | Out-File -FilePath services\job\.env -Encoding utf8

# Create Payment Service .env (YOU NEED TO ADD YOUR RAZORPAY KEYS)
@"
PORT=5004
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
Razorpay_Key=your-razorpay-key-id
Razorpay_Secret=your-razorpay-key-secret
"@ | Out-File -FilePath services\payment\.env -Encoding utf8

# Create Utils Service .env (YOU NEED TO ADD YOUR CREDENTIALS)
@"
PORT=5001
Kafka_Broker=localhost:9092
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
API_KEY_GEMINI=your-google-gemini-api-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
"@ | Out-File -FilePath services\utils\.env -Encoding utf8
```

### macOS/Linux
```bash
# Navigate to project root
cd job-portal

# Create Auth Service .env
cat > services/auth/.env << 'EOF'
PORT=5000
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
UPLOAD_SERVICE=http://localhost:5001
JWT_SEC=kfdlsajeroifwahneflk
Kafka_Broker=localhost:9092
Frontend_Url=http://localhost:3000
Redis_url=redis://localhost:6379
EOF

# Create User Service .env
cat > services/user/.env << 'EOF'
PORT=5002
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
UPLOAD_SERVICE=http://localhost:5001
EOF

# Create Job Service .env
cat > services/job/.env << 'EOF'
PORT=5003
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
Kafka_Broker=localhost:9092
UPLOAD_SERVICE=http://localhost:5001
EOF

# Create Payment Service .env (YOU NEED TO ADD YOUR RAZORPAY KEYS)
cat > services/payment/.env << 'EOF'
PORT=5004
DB_URL=postgresql://neondb_owner:npg_b5rapMjzwR3Q@ep-polished-band-aeywc0h8-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SEC=kfdlsajeroifwahneflk
Razorpay_Key=your-razorpay-key-id
Razorpay_Secret=your-razorpay-key-secret
EOF

# Create Utils Service .env (YOU NEED TO ADD YOUR CREDENTIALS)
cat > services/utils/.env << 'EOF'
PORT=5001
Kafka_Broker=localhost:9092
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
API_KEY_GEMINI=your-google-gemini-api-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EOF
```

---

## ✅ Checklist

After creating all `.env` files, verify:

- [ ] `services/auth/.env` - Created with your values ✅
- [ ] `services/user/.env` - Created with same DB_URL and JWT_SEC
- [ ] `services/job/.env` - Created with same DB_URL and JWT_SEC
- [ ] `services/payment/.env` - Created with Razorpay credentials added
- [ ] `services/utils/.env` - Created with Cloudinary, Gemini, and Gmail credentials added
- [ ] All services use the same `JWT_SEC=kfdlsajeroifwahneflk`
- [ ] All services use the same `DB_URL` (or separate if you prefer)

---

## 🔐 Still Need Credentials?

1. **Razorpay**: https://dashboard.razorpay.com/app/keys
2. **Cloudinary**: https://console.cloudinary.com/settings/api-keys
3. **Google Gemini**: https://aistudio.google.com/app/apikey
4. **Gmail App Password**: https://myaccount.google.com/apppasswords

---

## 🚨 Security Reminder

**NEVER commit `.env` files to git!** They contain sensitive credentials. These files should already be in `.gitignore`.
