# AWS Architecture - AI for Bharat Hackathon
## AI-Powered Learning & Productivity Assistant

---

##  **AWS-Only Architecture**

### **Core AWS Services**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              React Frontend                             ││
│  │           (Hosted on Amazon S3)                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Amazon API Gateway                         │
│  • REST API endpoints                                      │
│  • CORS configuration                                      │
│  • Request/Response transformation                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS Lambda                               │
│  • Node.js 18.x runtime                                   │
│  • Express.js application                                 │
│  • Serverless architecture                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Amazon Bedrock                             │
│  • Claude v2 / Titan models                               │
│  • AI-powered responses                                   │
│  • Educational content generation                         │
└─────────────────────────────────────────────────────────────┘
```

---

##  **Service Details**

### **1. Amazon S3 - Frontend Hosting**
- **Purpose**: Host React application
- **Configuration**: Static website hosting
- **Features**: 
  - CloudFront CDN integration
  - Custom domain support
  - HTTPS enabled

### **2. Amazon API Gateway - API Management**
- **Purpose**: REST API for frontend-backend communication
- **Endpoints**:
  - `GET /health` - Health check
  - `POST /chat` - AI chat interface
- **Features**:
  - CORS enabled
  - Request validation
  - Rate limiting (future)

### **3. AWS Lambda - Backend Compute**
- **Purpose**: Serverless backend processing
- **Runtime**: Node.js 18.x
- **Framework**: Express.js with serverless-http
- **Features**:
  - Auto-scaling
  - Pay-per-request
  - No server management

### **4. Amazon Bedrock - AI Models**
- **Purpose**: AI-powered educational responses
- **Models**: 
  - Anthropic Claude v2 (primary)
  - Amazon Titan (fallback)
- **Features**:
  - Beginner-friendly explanations
  - Code examples
  - Analogies and examples

---

##  **Cost Optimization**

### **Free Tier Benefits**
```yaml
AWS Lambda:
  - 1M free requests/month
  - 400,000 GB-seconds compute time

API Gateway:
  - 1M free API calls/month

S3:
  - 5GB free storage
  - 20,000 GET requests
  - 2,000 PUT requests

Bedrock:
  - Pay-per-token pricing
  - No upfront costs
```

### **Estimated Hackathon Costs**
- **Lambda**: $0 (within free tier)
- **API Gateway**: $0 (within free tier)
- **S3**: $0-2 (minimal storage)
- **Bedrock**: $5-20 (token usage)
- **Total**: $5-22 for hackathon period

---

##  **Deployment Strategy**

### **Phase 1: Local Development**
```bash
# Backend
cd backend
npm install
npm start

# Frontend  
cd frontend
npm install
npm start
```

### **Phase 2: AWS Deployment**
```bash
# Deploy Lambda + API Gateway
cd backend
serverless deploy

# Deploy Frontend to S3
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name
```

### **Phase 3: Bedrock Integration**
```bash
# Add AWS SDK
npm install @aws-sdk/client-bedrock-runtime

# Update IAM permissions
# Enable Bedrock model access
# Replace dummy responses with real AI
```

---

##  **Configuration Files**

### **Backend (serverless.yml)**
```yaml
service: ai-learning-assistant-aws-hackathon
provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
functions:
  api:
    handler: handler.handler
    events:
      - http: ANY /{proxy+}
```

### **Frontend (package.json)**
```json
{
  "name": "ai-learning-assistant-frontend",
  "dependencies": {
    "react": "^18.2.0",
    "axios": "^1.6.0"
  },
  "scripts": {
    "build": "react-scripts build",
    "deploy": "aws s3 sync build/ s3://bucket-name"
  }
}
```

---

##  **Hackathon Advantages**

### **AWS-Native Benefits**
- ✅ **Scalable**: Auto-scales with demand
- ✅ **Cost-Effective**: Pay only for usage
- ✅ **Reliable**: 99.9% uptime SLA
- ✅ **Secure**: Built-in security features
- ✅ **Fast**: Global CDN distribution

### **Development Speed**
- ✅ **Serverless**: No infrastructure management
- ✅ **Managed Services**: Focus on code, not servers
- ✅ **Quick Deployment**: One command deployment
- ✅ **Easy Scaling**: Automatic capacity management

---

##  **Implementation Checklist**

### ** Completed**
- [x] Express.js backend with Lambda compatibility
- [x] Serverless framework configuration
- [x] Health check endpoint
- [x] Chat endpoint with dummy responses
- [x] CORS configuration
- [x] Local development setup

### ** In Progress**
- [ ] React frontend development
- [ ] Frontend-backend integration
- [ ] Local testing completion

### ** Next Steps**
- [ ] AWS Lambda deployment
- [ ] API Gateway configuration
- [ ] S3 frontend hosting
- [ ] Amazon Bedrock integration
- [ ] Production testing

---

##  **Hackathon Readiness**

**Current Status**: **AWS Architecture Ready**

- **Backend**: Lambda-compatible Express.js server
- **API**: RESTful endpoints with proper CORS
- **Deployment**: Serverless framework configured
- **AI Integration**: Bedrock-ready architecture
- **Frontend**: React app structure planned

 Complete frontend and test locally
Deploy to AWS and integrate Bedrock
**Demo Ready**: Full AWS-powered AI learning assistant

---

*This architecture is optimized for the AI for Bharat AWS Hackathon, leveraging AWS services for maximum scalability, cost-effectiveness, and development speed.*
