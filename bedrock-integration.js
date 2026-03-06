/**
 * Amazon Bedrock Integration Module
 * AI for Bharat AWS Hackathon
 * 
 * Real AWS Bedrock integration with Claude 3 Haiku
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

// Initialize Bedrock client
// In Lambda, credentials are automatically provided by IAM role
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Invoke Amazon Bedrock AI Model
 * @param {string} message - User's question
 * @param {string} modelId - Bedrock model ID
 * @returns {object} AI response with metadata
 */
async function invokeBedrockModel(message, modelId = null) {
  try {
    const selectedModel = modelId || process.env.BEDROCK_MODEL_ID || 'us.amazon.nova-micro-v1:0';
    console.log('🤖 Invoking Bedrock model:', selectedModel);
    
    // Prepare the prompt based on model type
    let prompt;
    
    if (selectedModel.includes('anthropic')) {
      // Claude models format
      prompt = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `You are a patient and encouraging coding tutor for beginner developers. 
Your goal is to help students learn programming concepts in a simple, friendly way.

Guidelines:
- Use simple language and avoid jargon
- Provide practical code examples when relevant
- Use analogies to explain complex concepts
- Be encouraging and supportive
- Break down complex topics into smaller steps

Student Question: ${message}

Please provide a helpful, beginner-friendly response:`
          }
        ]
      };
    } else if (selectedModel.includes('nova') || selectedModel.includes('titan')) {
      // Amazon Nova/Titan models format - STRUCTURED TEXT OUTPUT
      prompt = {
        messages: [
          {
            role: "user",
            content: [
              {
                text: `You are a beginner-friendly AI programming tutor.

You MUST respond in this EXACT format (copy this structure exactly):

Simple Explanation:
[Write 2-3 short sentences with an analogy]

Key Points:
- [First key point]
- [Second key point]
- [Third key point]

Example (JavaScript):
[Write actual working code, no backticks]

Next Suggested Topic:
[Suggest one related topic to learn next]

CRITICAL RULES:
- Follow the format EXACTLY as shown above
- Keep total response under 180 words
- NO markdown symbols (###, **, \`\`\`)
- NO extra text outside the format
- Use simple beginner language
- Always include all 4 sections

Question: ${message}

Your response:`
              }
            ]
          }
        ],
        inferenceConfig: {
          max_new_tokens: 400,
          temperature: 0.5
        }
      };
    } else {
      // Generic format
      prompt = {
        messages: [{ role: "user", content: message }],
        max_tokens: 1000,
        temperature: 0.7
      };
    }

    const input = {
      modelId: selectedModel,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(prompt)
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ Bedrock response received');
    
    // Extract text based on model type
    let responseText;
    if (responseBody.content && Array.isArray(responseBody.content)) {
      // Claude format
      responseText = responseBody.content[0].text;
    } else if (responseBody.output && responseBody.output.message) {
      // Nova format
      responseText = responseBody.output.message.content[0].text;
    } else if (responseBody.results && responseBody.results[0]) {
      // Titan format
      responseText = responseBody.results[0].outputText;
    } else {
      responseText = JSON.stringify(responseBody);
    }
    
    // Parse structured text response into sections
    const structuredResponse = parseStructuredResponse(responseText);
    
    return {
      response: structuredResponse,
      model: selectedModel,
      tokens_used: responseBody.usage?.total_tokens || responseBody.usage?.totalTokens || 0,
      status: 'success'
    };

  } catch (error) {
    console.error('❌ Bedrock integration error:', error.message);
    
    // Fallback to demo mode if Bedrock fails
    return {
      response: {
        explanation: `I'm having trouble connecting to AWS Bedrock right now. Here's a demo response about "${message}".`,
        keyPoints: ['Powered by Amazon Nova Micro', 'Real AI integration active', 'Fallback mode engaged'],
        example: '// Demo mode - check AWS credentials',
        nextTopic: 'Try asking another question!'
      },
      model: 'demo-fallback',
      tokens_used: 0,
      status: 'fallback',
      error: error.message
    };
  }
}

/**
 * Parse structured text response into JSON object
 * Extracts: explanation, keyPoints, example, nextTopic
 */
function parseStructuredResponse(text) {
  try {
    const sections = {
      explanation: '',
      keyPoints: [],
      example: '',
      nextTopic: ''
    };

    // Clean up the text - remove extra whitespace
    const cleanText = text.trim();

    // Extract Simple Explanation (more flexible regex)
    const explanationMatch = cleanText.match(/Simple Explanation:\s*\n+([\s\S]*?)(?=\n+Key Points:|$)/i);
    if (explanationMatch) {
      sections.explanation = explanationMatch[1].trim();
    }

    // Extract Key Points (more flexible - handles various bullet formats)
    const keyPointsMatch = cleanText.match(/Key Points:\s*\n+([\s\S]*?)(?=\n+Example|$)/i);
    if (keyPointsMatch) {
      const pointsText = keyPointsMatch[1];
      const points = pointsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(point => point.length > 0);
      
      if (points.length > 0) {
        sections.keyPoints = points;
      }
    }

    // Extract Example (more flexible - handles various formats)
    const exampleMatch = cleanText.match(/Example[^:]*:\s*\n+([\s\S]*?)(?=\n+Next Suggested Topic:|$)/i);
    if (exampleMatch) {
      let exampleCode = exampleMatch[1].trim();
      // Remove markdown code blocks if present
      exampleCode = exampleCode.replace(/```[\w]*\n?/g, '').trim();
      sections.example = exampleCode;
    }

    // Extract Next Suggested Topic (more flexible)
    const nextTopicMatch = cleanText.match(/Next Suggested Topic:\s*\n+(.*?)$/is);
    if (nextTopicMatch) {
      sections.nextTopic = nextTopicMatch[1].trim();
    }

    // Validation: Ensure we have at least explanation and key points
    if (!sections.explanation || sections.keyPoints.length === 0) {
      console.warn('⚠️ Incomplete structured response, applying fallback');
      
      // Try to extract any meaningful content
      if (!sections.explanation) {
        // Use first paragraph as explanation
        const firstPara = cleanText.split('\n\n')[0];
        sections.explanation = firstPara.substring(0, 200);
      }
      
      if (sections.keyPoints.length === 0) {
        // Generate generic key points
        sections.keyPoints = [
          'This is a fundamental programming concept',
          'Understanding this will help you write better code',
          'Practice with examples to master this topic'
        ];
      }
      
      if (!sections.example) {
        sections.example = '// Example code will appear here';
      }
      
      if (!sections.nextTopic) {
        sections.nextTopic = 'Ask me about related topics!';
      }
    }

    console.log('✅ Parsed structured text response:', {
      hasExplanation: !!sections.explanation,
      keyPointsCount: sections.keyPoints.length,
      hasExample: !!sections.example,
      hasNextTopic: !!sections.nextTopic
    });
    
    return sections;

  } catch (error) {
    console.error('⚠️ Error parsing structured response:', error);
    return {
      explanation: 'I encountered an issue formatting the response. Let me try again with a different question.',
      keyPoints: [
        'Try asking your question in a different way',
        'I work best with specific programming questions',
        'Examples: "What is a variable?" or "How do loops work?"'
      ],
      example: '// Ask me a programming question!',
      nextTopic: 'Try asking another question'
    };
  }
}

/**
 * Invoke Bedrock Model for Code Debugging (JSON Response)
 * Separate function that returns RAW JSON without chat parsing
 * @param {string} debugPrompt - Debug analysis prompt
 * @returns {object} Raw JSON debug response
 */
async function invokeBedrockModelForDebug(debugPrompt) {
  try {
    const selectedModel = process.env.BEDROCK_MODEL_ID || 'us.amazon.nova-micro-v1:0';
    console.log('🐛 Invoking Bedrock for debug analysis:', selectedModel);
    
    // Prepare debug-specific prompt (expects JSON response)
    const prompt = {
      messages: [
        {
          role: "user",
          content: [
            {
              text: debugPrompt
            }
          ]
        }
      ],
      inferenceConfig: {
        max_new_tokens: 800,
        temperature: 0.3  // Lower temperature for more precise analysis
      }
    };

    const input = {
      modelId: selectedModel,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(prompt)
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ Bedrock debug response received');
    
    // Extract raw text (do NOT parse as chat)
    let responseText;
    if (responseBody.output && responseBody.output.message) {
      // Nova format
      responseText = responseBody.output.message.content[0].text;
    } else if (responseBody.content && Array.isArray(responseBody.content)) {
      // Claude format
      responseText = responseBody.content[0].text;
    } else if (responseBody.results && responseBody.results[0]) {
      // Titan format
      responseText = responseBody.results[0].outputText;
    } else {
      responseText = JSON.stringify(responseBody);
    }
    
    console.log('📄 Raw Bedrock response (first 200 chars):', responseText.substring(0, 200));
    
    // Parse as JSON (debug-specific parser)
    const debugResult = parseDebugResponse(responseText);
    
    return {
      debug: debugResult,
      model: selectedModel,
      tokens_used: responseBody.usage?.total_tokens || responseBody.usage?.totalTokens || 0,
      status: 'success'
    };

  } catch (error) {
    console.error('❌ Bedrock debug integration error:', error.message);
    
    // Fallback: assume code is correct if Bedrock fails
    return {
      debug: {
        hasError: false,
        issues: [],
        fixedCode: null,
        analysis: 'Unable to analyze code at this time. Please try again.',
        tip: 'Check your AWS Bedrock connection.'
      },
      model: 'debug-fallback',
      tokens_used: 0,
      status: 'fallback',
      error: error.message
    };
  }
}

/**
 * Parse debug response as strict JSON
 * Expects: { hasError, issues, fixedCode, analysis, tip }
 */
function parseDebugResponse(text) {
  try {
    const cleanText = text.trim();
    
    // Try to extract JSON from response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.warn('⚠️ No JSON found in debug response');
      return {
        hasError: false,
        issues: [],
        fixedCode: null,
        analysis: 'Code analysis completed. No structured results available.',
        tip: 'Try running the code to verify it works correctly.'
      };
    }
    
    const debugResult = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (typeof debugResult.hasError !== 'boolean') {
      console.warn('⚠️ Invalid debug response: missing hasError field');
      debugResult.hasError = false;
    }
    
    if (!Array.isArray(debugResult.issues)) {
      console.warn('⚠️ Invalid debug response: issues is not an array');
      debugResult.issues = [];
    }
    
    // Ensure all issues have required fields
    debugResult.issues = debugResult.issues.map(issue => ({
      line: issue.line || 0,
      type: issue.type || 'Unknown',
      message: issue.message || 'No description provided'
    }));
    
    console.log('✅ Parsed debug JSON:', {
      hasError: debugResult.hasError,
      issuesCount: debugResult.issues.length,
      hasFixedCode: !!debugResult.fixedCode
    });
    
    return debugResult;

  } catch (error) {
    console.error('⚠️ Error parsing debug JSON:', error.message);
    
    // Fallback: assume code is correct
    return {
      hasError: false,
      issues: [],
      fixedCode: null,
      analysis: 'Unable to parse debug results. Code may be correct.',
      tip: 'Try running the code to verify it works correctly.'
    };
  }
}

module.exports = {
  invokeBedrockModel,
  invokeBedrockModelForDebug
};