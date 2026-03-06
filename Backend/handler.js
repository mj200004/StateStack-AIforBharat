const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { invokeBedrockModel, invokeBedrockModelForDebug } = require('./bedrock-integration');
const db = require('./dynamodb-helper');

// Generate UUID using crypto (built-in Node.js module)
function uuidv4() {
  return crypto.randomUUID();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * AI Response Generator - Real Amazon Bedrock Integration
 * Uses AWS Bedrock Claude 3 Haiku for AI responses
 */
async function generateAIResponse(message) {
  try {
    console.log('🤖 Processing message with AWS Bedrock:', message);
    
    // Call real Amazon Bedrock
    const bedrockResponse = await invokeBedrockModel(message);
    
    if (bedrockResponse.status === 'success') {
      // Real Bedrock response - already structured JSON
      const structured = typeof bedrockResponse.response === 'object' 
        ? bedrockResponse.response 
        : {
            explanation: bedrockResponse.response,
            keyPoints: ['Powered by Amazon Nova Micro'],
            example: '',
            nextTopic: 'Ask me anything else!'
          };
      
      return {
        structured,
        model: bedrockResponse.model,
        timestamp: new Date().toISOString(),
        tokens_used: bedrockResponse.tokens_used,
        status: 'bedrock_active'
      };
    } else {
      // Fallback mode if Bedrock fails
      console.warn('⚠️ Using fallback mode');
      return getFallbackResponse(message, bedrockResponse.error);
    }

  } catch (error) {
    console.error('❌ Error in generateAIResponse:', error);
    return getFallbackResponse(message, error.message);
  }
}

/**
 * Fallback response when Bedrock is unavailable
 */
function getFallbackResponse(message, errorMsg) {
  const messageLower = message.toLowerCase();
  
  const responses = {
    'variable': {
      explanation: "A variable is like a labeled box where you store things!",
      keyPoints: ["Variables store data", "Use 'let' for changing values, 'const' for constants"],
      example: "let age = 25;\nconst name = 'Alice';",
      nextTopic: "Learn about Data Types"
    },
    'function': {
      explanation: "A function is like a recipe - it takes inputs and produces outputs!",
      keyPoints: ["Functions are reusable code blocks", "They can take parameters and return values"],
      example: "function greet(name) {\n  return 'Hello, ' + name;\n}",
      nextTopic: "Learn about Arrow Functions"
    },
    'default': {
      explanation: `I'm your AI Learning Assistant! ${errorMsg ? '(Fallback mode: ' + errorMsg + ')' : ''} Ask me about programming concepts.`,
      keyPoints: ["Ask about any programming concept", "I'll explain with examples"],
      example: "// Try: 'What is a variable?'",
      nextTopic: "Ask me anything!"
    }
  };

  let response = responses.default;
  if (messageLower.includes('variable')) response = responses.variable;
  else if (messageLower.includes('function')) response = responses.function;

  return {
    structured: response,
    model: 'Fallback Mode',
    timestamp: new Date().toISOString(),
    tokens_used: 0,
    status: 'fallback'
  };
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🤖 AI Learning Assistant API',
    status: 'Running',
    hackathon: 'AI for Bharat AWS Hackathon',
    endpoints: {
      health: 'GET /health',
      chat: 'POST /chat'
    },
    version: '2.0.0 - AWS Bedrock Integrated'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Learning Assistant API - AWS Bedrock Active!',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    architecture: {
      compute: 'AWS Lambda',
      ai_model: 'Amazon Bedrock Claude 3 Haiku',
      api_gateway: 'Amazon API Gateway',
      database: 'Amazon DynamoDB',
      frontend_hosting: 'AWS Amplify'
    },
    region: process.env.AWS_REGION || 'ap-south-2'
  });
});

// Main chat endpoint - Lambda compatible
app.post('/chat', async (req, res) => {
  try {
    const { question, message } = req.body;
    const userMessage = question || message;
    
    if (!userMessage) {
      return res.status(400).json({ 
        error: 'Question or message is required',
        example: { question: "What is a variable?" }
      });
    }

    console.log('📨 Received user message:', userMessage);

    // Generate AI response using AWS Bedrock
    const aiResult = await generateAIResponse(userMessage);

    console.log('✅ Generated AI response');

    res.json({ 
      structured: aiResult.structured,
      metadata: {
        model: aiResult.model,
        timestamp: aiResult.timestamp,
        tokens_used: aiResult.tokens_used,
        status: aiResult.status,
        processed_by: 'AWS Lambda + Bedrock',
        hackathon: 'AI for Bharat AWS Hackathon'
      }
    });

  } catch (error) {
    console.error('❌ Error in /chat endpoint:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Debug endpoint - Code analysis with structured response
app.post('/debug', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Code is required',
        example: { code: "function test() { ... }", language: "javascript" }
      });
    }

    console.log('🐛 Received code for debugging:', language || 'unknown');

    // Create specialized debug prompt with STRICT constraints
    const debugPrompt = `You are a strict code analyzer. Do NOT guess. Do NOT invent syntax errors. If unsure, do not report a syntax error. Only report issues that are clearly present.

Code to analyze:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

1. YOU ARE NOT A PARSER:
   - You cannot truly parse syntax
   - Do NOT report syntax errors unless ABSOLUTELY CERTAIN
   - Do NOT claim "unmatched braces" unless you manually counted and verified
   - When in doubt about syntax → DO NOT REPORT IT

2. ERROR TYPE DEFINITIONS (Use these EXACT categories):
   
   A. Syntax Error (RARE - only if code won't parse):
      - Missing closing quote
      - Invalid token
      - ONLY if you are 100% certain the code won't run at all
   
   B. Undefined Variable (COMMON - check carefully):
      - Variable used but never declared
      - Variable used before declaration
      - Variable not in scope
   
   C. Runtime Error (COMMON):
      - Calling undefined function
      - Accessing property of null/undefined
      - Type mismatch that will crash
   
   D. Logic Error (COMMON):
      - Off-by-one errors
      - Wrong calculation
      - Incorrect condition

3. ANALYSIS PROCESS:
   Step 1: Count braces manually: { and }
   Step 2: If counts match → DO NOT report brace error
   Step 3: Check each variable: Is it declared before use?
   Step 4: Check function calls: Are arguments provided?
   Step 5: Only report issues you found in steps 3-4

4. RESPONSE FORMAT (STRICT JSON):

If code is CORRECT:
{
  "hasError": false,
  "issues": [],
  "fixedCode": null,
  "analysis": "Code structure is valid. No issues detected.",
  "tip": "Keep writing clean code!"
}

If code has REAL ERRORS:
{
  "hasError": true,
  "issues": [
    {
      "line": <actual_line_number>,
      "type": "Undefined Variable|Runtime Error|Logic Error|Syntax Error",
      "message": "Specific description of the actual issue"
    }
  ],
  "fixedCode": "ONLY include if you can fix it - do NOT just repeat the same code",
  "analysis": "Clear explanation of what is actually wrong",
  "tip": "Educational insight"
}

5. STRICT RULES:
   ✅ DO report: Undefined variables, missing arguments, null references
   ✅ DO verify: Variable declarations, function parameters, scope
   ❌ DO NOT report: Fake brace errors, imagined syntax issues
   ❌ DO NOT guess: If unsure, say code is correct
   ❌ DO NOT repeat: Same code as "fixed" code

6. EXAMPLE - What to detect:
   \`\`\`javascript
   function calc(items) {
     let total = 0;
     for (let i = 0; i < items.length; i++) {
       total += items[i].price * taxRate;  // taxRate undefined!
     }
     return total;
   }
   \`\`\`
   
   CORRECT DETECTION:
   - Issue: taxRate is undefined (Undefined Variable)
   - Line: 4
   - Type: "Undefined Variable"
   
   WRONG DETECTION:
   - "Unmatched braces" ← NO! Braces are matched!
   - "Syntax error" ← NO! Syntax is valid!

7. FINAL CHECK:
   - Did you manually count braces? If not, don't report brace error
   - Did you check variable declarations? If not, don't report undefined
   - Are you 100% certain? If not, say code is correct

Return ONLY valid JSON, no extra text:`;

    // Call Bedrock with debug-specific function (NOT chat parser)
    const bedrockResponse = await invokeBedrockModelForDebug(debugPrompt);
    
    console.log('✅ Debug analysis complete:', {
      hasError: bedrockResponse.debug.hasError,
      issuesCount: bedrockResponse.debug.issues?.length || 0
    });

    res.json({
      debug: bedrockResponse.debug,
      metadata: {
        model: bedrockResponse.model,
        timestamp: new Date().toISOString(),
        tokens_used: bedrockResponse.tokens_used,
        status: bedrockResponse.status,
        language: language || 'unknown'
      }
    });

  } catch (error) {
    console.error('❌ Error in /debug endpoint:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error analyzing your code.',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// ========================================
// AUTHENTICATION ENDPOINTS
// ========================================

// User Registration
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = uuidv4();
    const user = await db.createUser({
      userId,
      name,
      email,
      passwordHash
    });
    
    // Return user data (without password)
    const { passwordHash: _, ...userData } = user;
    res.json({ 
      success: true, 
      user: userData 
    });
    
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Get user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Update last login
    await db.updateUserLogin(user.userId);
    
    // Return user data (without password)
    const { passwordHash: _, ...userData } = user;
    res.json({ 
      success: true, 
      user: userData 
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get User Profile
app.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data (without password)
    const { passwordHash: _, ...userData } = user;
    res.json(userData);
    
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ========================================
// CHAT HISTORY ENDPOINTS
// ========================================

// Save Chat
app.post('/chat/save', async (req, res) => {
  try {
    const { userId, chatId, messages, title } = req.body;
    
    if (!userId || !chatId || !messages) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const chat = await db.saveChat(userId, chatId, messages, title);
    res.json({ success: true, chat });
    
  } catch (error) {
    console.error('❌ Save chat error:', error);
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

// Get User Chats
app.get('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chats = await db.getUserChats(userId);
    res.json({ chats });
    
  } catch (error) {
    console.error('❌ Get chats error:', error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
});

// Get Specific Chat
app.get('/chat/:userId/:timestamp', async (req, res) => {
  try {
    const { userId, timestamp } = req.params;
    
    const chat = await db.getChat(userId, timestamp);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json(chat);
    
  } catch (error) {
    console.error('❌ Get chat error:', error);
    res.status(500).json({ error: 'Failed to get chat' });
  }
});

// Delete Chat
app.delete('/chat/:userId/:timestamp', async (req, res) => {
  try {
    const { userId, timestamp } = req.params;
    
    await db.deleteChat(userId, timestamp);
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

// ========================================
// LEARNING PROGRESS ENDPOINTS
// ========================================

// Save Progress
app.post('/progress/save', async (req, res) => {
  try {
    const { userId, topicId, progressData } = req.body;
    
    if (!userId || !topicId || !progressData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const progress = await db.saveProgress(userId, topicId, progressData);
    
    // Update user XP if topic completed
    if (progressData.completed && progressData.xpEarned) {
      await db.updateUserXP(userId, progressData.xpEarned);
    }
    
    res.json({ success: true, progress });
    
  } catch (error) {
    console.error('❌ Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get User Progress
app.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const progress = await db.getUserProgress(userId);
    res.json({ progress });
    
  } catch (error) {
    console.error('❌ Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get Topic Progress
app.get('/progress/:userId/:topicId', async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    
    const progress = await db.getTopicProgress(userId, topicId);
    res.json({ progress: progress || null });
    
  } catch (error) {
    console.error('❌ Get topic progress error:', error);
    res.status(500).json({ error: 'Failed to get topic progress' });
  }
});

// Export for serverless (AWS Lambda)
module.exports.handler = serverless(app);

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`🚀 AI Learning Assistant API running on port ${port}`);
    console.log(`📋 Health check: http://localhost:${port}/health`);
    console.log(`💬 Chat endpoint: http://localhost:${port}/chat`);
    console.log(`🤖 AI Model: Amazon Bedrock ${process.env.BEDROCK_MODEL_ID || 'Nova Micro'}`);
    console.log(`🌍 Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log(`🏆 AWS Hackathon Ready - Bedrock Integrated!`);
  });
}
