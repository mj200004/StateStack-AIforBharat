# Team StateStack
AI-Powered Learning Assistant for beginner developers. Personalized tutoring, debugging, and progress tracking using AWS Bedrock + Lambda. AI for Bharat Hackathon Prototype.
StateStack - AI Learning Assistant for Beginners

Status: Idea Submission Qualified

Problem Statement
Beginner developers struggle with complex technical jargon, unstructured learning resources, and no clear learning path.

Our Solution
AI-Powered tutor that provides simple explanations, personalized learning paths, code debugging help, and progress tracking dashboard.

Architecture (AWS-Native)
[Architecture Diagram](ai_learning_assistant_architecture.png)

Core Stack:
AWS: Lambda + API Gateway + Bedrock + S3 + DynamoDB
AI: Claude 3 Haiku + Titan Embeddings  
Backend: Node.js REST APIs
Vector DB: ChromaDB on EC2

Phase 1 Wireframes
[Wireframes](wireframes.png)
Chat-based learning interface
Code assistance tool
Learning path dashboard

Complete Documentation
Design & Architecture (design.md) - ITS architecture + TypeScript interfaces + 18 correctness properties
Requirements (requirements.md) - Detailed acceptance criteria
Usecase Diagram (usecase.png)

Prototype Phase Plan (24hr Goal)
User Query -> Lambda -> Bedrock Claude -> Explanation + Code -> DynamoDB
Test: "Explain Python loops" -> less than 2s response

AWS Credits Usage
$100 Credits Perfect For:
Lambda/API Gateway (free tier covers most)
Bedrock Claude inference (~$0.01/query)
S3/DynamoDB storage
ChromaDB on EC2 (small instance)

Repo: https://github.com/mj200004/StateStack-AIforBharat
