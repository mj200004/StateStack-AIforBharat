## 🤖 AI Learning Assistant
An interactive web application that helps beginner developers learn JavaScript through AI-powered assistance, code debugging, and structured learning paths.

## Features
AI Chat Assistant: Instant help with programming questions using AWS Bedrock

Code Debugger: AI-powered analysis and fixes for JavaScript code

Learning Path: 20 structured lessons on JavaScript fundamentals

Progress Tracking: XP system and completion badges

User Authentication: Secure login/registration

Cloud-Native: AWS deployment (DynamoDB, Lambda, CloudFront)

## Live Demo
Visit the live application: [https://di21r9s7dmq4q.cloudfront.net](https://di21r9s7dmq4q.cloudfront.net)


## Architecture

## Frontend
```
 1. Framework: React + Vite

 2. Styling: Custom CSS (teal/dark gradient theme)

 3. Deployment: AWS S3 + CloudFront CDN

Key Components: Landing page, auth, chat interface, debugger, learning path, lesson viewer
```
## Backend
```
 1. Runtime: Node.js on AWS Lambda

2. Framework: Serverless Framework

 3. API: AWS API Gateway (REST)

 4. AI: AWS Bedrock (Amazon Nova Micro)

 5. Database: AWS DynamoDB

Key Features: Auth (bcrypt), chat history, progress tracking, code analysis
```

## Prerequisites
```
Node.js 18+ and npm

AWS account with AWS CLI configured

Bedrock access (Amazon Nova Micro model)

## Permissions: DynamoDB, Lambda, API Gateway, S3, CloudFront
```
## Quick Start ##
## 1. Clone & Install
```
 bash
git clone <your-repo-url>
cd ai-learning-assistant

cd backend && npm install && cp .env.example .env  # Add AWS credentials
cd ../frontend && npm install
```
## 2. Setup Database
```
 bash
cd backend
node create-dynamodb-tables.js
Creates tables: ai-learning-users, ai-learning-chat-history, ai-learning-progress.
```
## 3. Deploy Backend
```
 bash
npx serverless deploy
Copy API Gateway URL from output.
```
## 4. Configure & Deploy Frontend
```
 javascript
// frontend/src/utils/constants.js
export const API_URL = 'https://your-api-gateway-url.amazonaws.com/dev';
 bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name/
```
##  Project Structure

```
ai-learning-assistant/
├── backend/
│   ├── handler.js              # Lambda function handlers
│   ├── bedrock-integration.js  # AWS Bedrock AI integration
│   ├── dynamodb-helper.js      # Database operations
│   ├── serverless.yml          # Serverless configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/              # React page components
│   │   ├── components/         # Reusable components
│   │   ├── utils/              # Utility functions
│   │   └── assets/             # Images and static files
│   ├── package.json
│   └── vite.config.js
├── docs/                       # Documentation
└── README.md
```

## Configuration
## Environment Variables (backend/.env)
## text
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```
## Bedrock Setup
```
AWS Bedrock Console → Model Access

Enable amazon.nova-micro-v1:0
```
## Learning Path
```
Variables & Data Types

Operators & Expressions

Conditionals

Loops

Functions
6-20. Coming soon!
```
## Detailed Features
```
AI Chat: Natural language Q&A, structured responses, chat history, voice input.
Code Debugger: Error analysis, fixes, explanations, learning tips.
Learning Path: Sequential lessons, XP progress, review mode.
```
## Security
```
IAM roles with least privilege

Bcrypt password hashing

HTTPS via CloudFront

Auth validation on API endpoints

Never commit credentials
```
## Contributing
Fork repository

Create feature branch

Commit changes

Open pull request

## License
MIT License

## Author

Created as part of an AWS learning project.

##  Acknowledgments

- AWS Bedrock for AI capabilities
- React and Vite for frontend framework
- Serverless Framework for easy deployment
- AWS Free Tier for hosting

##  Support

For issues or questions, please open a GitHub issue.
---
**Note**: This is an educational project. For production use, implement additional security measures, error handling, and monitoring.

Author
AWS learning project by [Your Name]
