# NexHire - Job Portal Platform

A modern, full-stack job portal application built with microservices architecture, featuring AI-powered resume analysis and career guidance.

## 🏗️ Architecture

- **Frontend**: Next.js 16 (React 19) with TypeScript
- **Backend**: Microservices architecture with Express.js
- **Database**: Neon PostgreSQL (Serverless)
- **Message Queue**: Apache Kafka
- **Cache**: Redis
- **File Storage**: Cloudinary
- **AI**: Google Gemini (Resume Analysis & Career Guidance)
- **Payment**: Razorpay
- **Email**: Gmail SMTP (via Kafka)

## 📁 Project Structure

```
job-portal/
├── frontend/              # Next.js frontend application
│   └── src/
│       ├── app/          # Next.js App Router pages
│       ├── components/   # React components
│       ├── context/      # React Context providers
│       └── lib/          # Utilities
│
└── services/             # Microservices
    ├── auth/            # Authentication service (Port 5000)
    ├── user/            # User management service (Port 5002)
    ├── job/             # Job posting service (Port 5003)
    ├── payment/         # Payment processing (Port 5004)
    └── utils/           # Utility service - Email, AI, Upload (Port 5001)
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- Kafka (for message queue)
- Redis (for caching)
- Docker (optional, recommended for Kafka/Redis)

### Setup Steps

1. **Read the Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions
2. **Quick Start**: See [QUICK_START.md](./QUICK_START.md) for condensed version

### Quick Command Reference

```bash
# 1. Start Infrastructure (Kafka + Redis)
docker-compose -f docker-compose.infrastructure.yml up -d

# 2. Start Services (in separate terminals)
cd services/utils && npm install && npm run build && npm start
cd services/auth && npm install && npm run build && npm start
cd services/user && npm install && npm run build && npm start
cd services/job && npm install && npm run build && npm start
cd services/payment && npm install && npm run build && npm start

# 3. Start Frontend
cd frontend && npm install && npm run dev
```

## 🔑 Required External Services

You'll need accounts and API keys from:

1. **Neon Database** - [Sign up](https://neon.tech)
2. **Cloudinary** - [Sign up](https://cloudinary.com)
3. **Google Gemini AI** - [Get API Key](https://aistudio.google.com/)
4. **Razorpay** - [Sign up](https://razorpay.com)
5. **Gmail** - For SMTP (Enable App Password)

## 📝 Environment Variables

Each service requires a `.env` file. See:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md#-environment-variables) for complete list
- Copy `.env.example` files (if available) and fill in your values

## 🎯 Features

### For Job Seekers
- ✅ User registration and authentication
- ✅ Profile management with skills
- ✅ Resume upload and analysis (ATS scoring)
- ✅ AI-powered career guidance
- ✅ Job search and application
- ✅ Application tracking

### For Recruiters
- ✅ Company profile creation
- ✅ Job posting management
- ✅ Application management
- ✅ Subscription/payment system

## 🛠️ Development

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js application |
| Auth Service | 5000 | Authentication & authorization |
| Utils Service | 5001 | Email, AI, File upload |
| User Service | 5002 | User profile management |
| Job Service | 5003 | Job posting & applications |
| Payment Service | 5004 | Payment processing |

### Development Mode

Run services in development mode for auto-reload:

```bash
npm run dev  # Instead of npm start
```

### Database

- Tables are automatically created on service startup
- All services use Neon PostgreSQL (serverless)
- Each service manages its own schema

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide

## 🔍 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Port already in use | Change PORT in `.env` or kill process |
| Kafka connection failed | Ensure Zookeeper is running first |
| JWT errors | Ensure JWT_SEC is identical across all services |
| Database errors | Verify DB_URL format and SSL mode |
| Email not sending | Check Gmail App Password and Kafka consumer |

For detailed troubleshooting, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#-troubleshooting)

## 🧪 Testing

1. **Test Services**: Visit service URLs (e.g., http://localhost:5000)
2. **Test Frontend**: Visit http://localhost:3000
3. **Register Account**: Create a new account
4. **Test Features**: Try job posting, application, resume analysis

## 📦 Deployment

Each service includes a `Dockerfile` for containerized deployment:

```bash
# Build service
docker build -t nexhire-auth ./services/auth

# Run service
docker run -p 5000:5000 --env-file .env nexhire-auth
```

## 🔐 Security Notes

- **Never commit `.env` files** to version control
- Use strong JWT secrets (minimum 32 characters)
- Keep API keys secure
- Use HTTPS in production
- Implement rate limiting in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Add your license here]

## 👥 Authors

[Add author information here]

## 🙏 Acknowledgments

- Next.js team
- Express.js community
- All open-source contributors

---

**Need Help?** Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions or open an issue.

Happy Coding! 🚀
"# NexHIre2" 
