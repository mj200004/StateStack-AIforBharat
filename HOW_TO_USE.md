# HOW TO USE - AI Learning Assistant

## BACKEND IS RUNNING

Your backend is running on:

http://localhost:3001


## WHAT YOU SEE IN BROWSER

When you visit:

http://localhost:3001

You will see a JSON response like this:

```json
{
  "message": "AI Learning Assistant API",
  "status": "Running",
  "endpoints": {
    "health": "GET /health",
    "chat": "POST /chat"
  }
}
```

This confirms the backend API is working correctly.


## HOW TO USE THE CHAT INTERFACE

### Option 1: Standalone HTML (Recommended)

1. Open File Explorer  
2. Navigate to the folder:

ai-learning-assistant

3. Double click the file:

frontend-standalone.html

4. The browser will open the chat interface  
5. Type a question and click Send


### Option 2: Test with Browser Console

1. Open:

http://localhost:3001

2. Press **F12** to open Developer Tools  
3. Go to the **Console** tab  
4. Paste the following code:

```javascript
fetch('http://localhost:3001/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({message: 'What is a variable?'})
})
.then(r => r.json())
.then(data => console.log(data.reply));
```

5. Press Enter  
6. The AI response will appear in the console


### Option 3: Test Using Command Prompt

Run this command:

```cmd
curl -X POST http://localhost:3001/chat -H "Content-Type: application/json" -d "{\"message\":\"What is a variable?\"}"
```


## API ENDPOINTS

### Root Endpoint

http://localhost:3001/

Shows API information.


### Health Check

http://localhost:3001/health

Shows system status.


### Chat Endpoint

POST http://localhost:3001/chat

Request body example:

```json
{
  "message": "Your question here"
}
```

Returns an AI response.


## RECOMMENDED METHOD FOR DEMO

The easiest way to demo the project:

1. Open **frontend-standalone.html**  
2. A chat interface will open in the browser  
3. Ask questions and view AI responses  


## SYSTEM STATUS

Backend API running on port 3001  
Chat endpoint ready to receive questions  
AI response system working  
Frontend HTML interface ready  


## DEMO SCRIPT

1. Open **frontend-standalone.html**  
2. Show the chat interface  
3. Ask: "What is a variable?"  
4. Show the AI response  
5. Ask: "What is an API?"  
6. Show another response  
7. Explain that the architecture can integrate with AWS Lambda and AWS Bedrock
