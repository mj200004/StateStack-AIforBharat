# Deploy Frontend to AWS Amplify - Manual Steps

## Issue: Workspace Path Contains Spaces

The current workspace directory contains spaces in its path, which can sometimes cause build or deployment issues. To avoid errors, follow the manual deployment steps described below.

---

## Quick Deployment Steps

### Step 1: Open PowerShell in the Frontend Directory

```powershell
cd "D:\AI-Powered Learning & Productivity Assistant for Beginner Developers\ai-learning-assistant\frontend"
```

---

### Step 2: Build the Frontend Application

```powershell
npm run build
```

This command generates a production-ready build and creates a `dist` folder containing optimized frontend files.

---

### Step 3: Initialize AWS Amplify

```powershell
amplify init
```

Provide the following responses when prompted:

Project name: `ailearningassistant`  
Environment: `production`  
Default editor: press Enter to continue  
Application type: `javascript`  
Framework: `react`  
Source directory: `src`  
Distribution directory: `dist`  
Build command: `npm run build`  
Start command: `npm run dev`  
AWS Profile: `default`

---

### Step 4: Add Hosting

```powershell
amplify add hosting
```

Select the following options:

Hosting service: **Amplify Console (Managed hosting)**  
Deployment type: **Manual deployment**

---

### Step 5: Publish the Application

```powershell
amplify publish
```

This step will:

- Upload the built frontend files
- Automatically configure CloudFront distribution
- Generate a public URL where the application can be accessed

---

# Alternative Method: Deploy Using Amazon S3

If Amplify deployment encounters issues, the application can be deployed directly using Amazon S3 static website hosting.

---

### Step 1: Build the Frontend

```powershell
cd "D:\AI-Powered Learning & Productivity Assistant for Beginner Developers\ai-learning-assistant\frontend"
npm run build
```

---

### Step 2: Create an S3 Bucket

```powershell
aws s3 mb s3://ai-learning-assistant-app --region us-east-1
```

---

### Step 3: Enable Static Website Hosting

```powershell
aws s3 website s3://ai-learning-assistant-app --index-document index.html --error-document index.html
```

---

### Step 4: Configure Bucket Policy

Create a file named `bucket-policy.json` inside the frontend directory.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ai-learning-assistant-app/*"
    }
  ]
}
```

Apply the policy:

```powershell
aws s3api put-bucket-policy --bucket ai-learning-assistant-app --policy file://bucket-policy.json
```

---

### Step 5: Upload the Build Files

```powershell
aws s3 sync dist/ s3://ai-learning-assistant-app --delete
```

---

### Step 6: Access the Website

The deployed application will be available at:

```
http://ai-learning-assistant-app.s3-website-us-east-1.amazonaws.com
```

---

# Recommended Approach

Using the Amplify CLI is generally recommended because it provides:

- Automatic HTTPS configuration
- Global CDN through CloudFront
- Simplified updates and redeployments
- Improved performance and scalability

Commands for the recommended approach:

```powershell
cd "D:\AI-Powered Learning & Productivity Assistant for Beginner Developers\ai-learning-assistant\frontend"
npm run build
amplify init
amplify add hosting
amplify publish
```

---

# Post Deployment Verification

After the deployment completes, verify that the application works correctly.

### Test the Application

Open the provided URL and verify the following features:

- Landing page loads correctly
- Login and signup functionality works
- AI chat interface responds correctly
- Code debugging tool functions properly
- Learning Path module displays progress information

---

### Check Browser Console

Open the browser developer tools (F12) and check:

- Any CORS related errors
- API calls being sent to the Lambda backend
- Chat or debugging requests returning proper responses

---

# Information to Share After Deployment

After completing the deployment process, record the following details:

1. Deployment method used (Amplify or S3)
2. Public URL of the deployed application
3. Any error messages encountered during deployment
4. Screenshot of the running application (optional)

---

# Troubleshooting

### Build Failure

If the build process fails, reinstall dependencies and rebuild.

```powershell
cd "D:\AI-Powered Learning & Productivity Assistant for Beginner Developers\ai-learning-assistant\frontend"
npm install
npm run build
```

---

### Amplify Initialization Failure

If `amplify init` fails, consider using the S3 deployment approach. It is simpler and works reliably for static applications.

---

### CORS Issues

CORS settings are already configured in the Lambda backend. If issues appear, verify that the frontend API endpoint matches the deployed backend URL.

---

# Start Deployment

Open PowerShell and run the following commands to begin deployment:

```powershell
cd "D:\AI-Powered Learning & Productivity Assistant for Beginner Developers\ai-learning-assistant\frontend"
npm run build
amplify init
```

Once the process completes, verify the deployed application using the generated public URL.
