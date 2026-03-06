# 🤖 AI Learning Assistant

An intelligent learning platform powered by AWS Bedrock that helps students learn programming through interactive chat, code debugging, and personalized learning paths.

##  AWS Hackathon Project

Built for the **AI for Bharat AWS Hackathon** using:
- **AWS Bedrock** (Amazon Nova Micro) - AI responses
- **AWS Lambda** - Serverless backend
- **Amazon API Gateway** - REST API
- **Amazon DynamoDB** - Data persistence
- **AWS Amplify** - Frontend hosting

---

##  Features

### 1. AI Chat Assistant
- Ask programming questions
- Get structured explanations with examples
- Interactive learning experience

### 2. Code Debugger
- Paste your code for analysis
- Get detailed error explanations
- Receive fixed code with learning tips

### 3. Learning Paths
- Structured programming courses
- Track your progress
- Interactive lessons with practice

### 4. Voice Input
- Speak your questions
- Hands-free learning experience

---

##  Quick Start (Local Development)

### Prerequisites
- Node.js 18+ installed
- AWS account with Bedrock access
- AWS credentials configured

### 1. Clone & Install
```bash
cd ai-learning-assistant

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure Environment
Create `backend/.env`:
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.amazon.nova-micro-v1:0
```

### 3. Start Servers
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 4. Open Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

##  AWS Deployment

### Step 1: Deploy Backend to Lambda
```bash
cd backend
npm install -g serverless
serverless deploy
```

### Step 2: Configure API Gateway
- Custom domain (optional)
- API throttling
- Usage plans

### Step 3: Set up DynamoDB
- Create users table
- Create chat history table
- Create progress table

### Step 4: Deploy Frontend to Amplify
- Update API URL
- Deploy to Amplify
- Configure custom domain

**Detailed Guide**: See `DEPLOYMENT_READY.md`

---

## 📚 Documentation

### Essential Guides
- **QUICK_START.md** - Local development setup
- **START_SERVERS.md** - How to run servers
- **HOW_TO_USE.md** - Application user guide
- **DEPLOYMENT_READY.md** - AWS deployment overview
- **STEP1_LAMBDA_DEPLOYMENT.md** - Lambda deployment details

### Archive
- Old documentation in `docs/archive/`
- Feature implementation history
- Previous AWS guides

---

##  Project Structure

```
ai-learning-assistant/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── pages/        # Chat, Debug, Learning Path
│   │   ├── components/   # Reusable components
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── backend/               # Express + Lambda functions
│   ├── handler.js        # Main Lambda handler
│   ├── bedrock-integration.js  # AWS Bedrock client
│   ├── serverless.yml    # Serverless config
│   └── package.json
│
├── docs/
│   └── archive/          # Old documentation
│
└── README.md             # This file
```

---

##  Tech Stack

### Frontend
- React 18
- Vite
- CSS3 (Custom styling)
- Web Speech API (Voice input)

### Backend
- Node.js 18
- Express.js
- Serverless Framework
- AWS SDK v3

### AWS Services
- **Bedrock** - AI model (Nova Micro)
- **Lambda** - Serverless compute
- **API Gateway** - REST API
- **DynamoDB** - NoSQL database
- **Amplify** - Frontend hosting
- **CloudWatch** - Logging & monitoring

---

##  Features in Detail

### Chat Interface
- Real-time AI responses
- Structured output (explanation, key points, examples)
- Message history
- Voice input support
- Summarize conversation

### Code Debugger
- Multi-language support (JavaScript, Python, Java, C++)
- Syntax error detection
- Logic error analysis
- Fixed code generation
- Learning tips

### Learning Paths
- Beginner to Advanced tracks
- Interactive lessons
- Code practice
- Progress tracking
- Achievement system

---

##  Configuration

### Backend Environment Variables
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=us.amazon.nova-micro-v1:0
DYNAMODB_USERS_TABLE=ai-learning-users
DYNAMODB_CHAT_TABLE=ai-learning-chat-history
DYNAMODB_PROGRESS_TABLE=ai-learning-progress
PORT=3001
NODE_ENV=development
```

### Frontend API Configuration
Update `frontend/src/utils/constants.js`:
```javascript
export const API_BASE_URL = 'http://localhost:3001'; // Local
// export const API_BASE_URL = 'https://your-api-gateway-url'; // Production
```

---

##  Testing

### Test Backend Locally
```bash
cd backend
node test-local.js
```

### Test Bedrock Integration
```bash
cd backend
node test-bedrock.js
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3001/health

# Chat
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a variable?"}'

# Debug
curl -X POST http://localhost:3001/debug \
  -H "Content-Type: application/json" \
  -d '{"code": "let x = 5;", "language": "javascript"}'
```

---

##  Cost Estimate

### Development/Testing
- Lambda: Free tier (1M requests/month)
- API Gateway: Free tier (1M calls/month)
- Bedrock: ~$0.01-0.10/day (Nova Micro)
- DynamoDB: Free tier (25GB storage)
- **Total**: < $5/month

### Production (1000 users)
- Lambda: ~$5/month
- API Gateway: ~$3.50/month
- Bedrock: ~$20-50/month
- DynamoDB: ~$5/month
- Amplify: ~$15/month
- **Total**: ~$50-80/month

---

##  Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

##  License

MIT License - See LICENSE file for details

---

##  Author

Built for AWS Hackathon 2024

---

##  Acknowledgments

- AWS Bedrock team for AI capabilities
- Serverless Framework for easy deployment
- React team for amazing frontend framework

---

##  Support

For issues or questions:
1. Check documentation in `docs/`
2. Review `QUICK_START.md`
3. See `DEPLOYMENT_READY.md` for AWS help

---

##  Roadmap

- [ ] User authentication (AWS Cognito)
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Gamification features
- [ ] Multi-language support

---

**Ready to deploy? See `DEPLOYMENT_READY.md` to get started!** 🚀
