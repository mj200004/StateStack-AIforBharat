/**
 * DynamoDB Helper Module
 * Provides database operations for users, chat history, and learning progress
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  QueryCommand, 
  UpdateCommand,
  DeleteCommand,
  ScanCommand
} = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client
// In Lambda, credentials are automatically provided by IAM role
const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables
const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || 'ai-learning-users';
const CHAT_TABLE = process.env.DYNAMODB_CHAT_TABLE || 'ai-learning-chat-history';
const PROGRESS_TABLE = process.env.DYNAMODB_PROGRESS_TABLE || 'ai-learning-progress';

/**
 * ========================================
 * USER OPERATIONS
 * ========================================
 */

/**
 * Create new user
 * @param {Object} userData - User data (userId, email, name, passwordHash)
 * @returns {Object} Created user object
 */
async function createUser(userData) {
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userData.userId,
      email: userData.email,
      name: userData.name,
      passwordHash: userData.passwordHash,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      totalXP: 0,
      level: 1,
      streak: 0
    }
  };
  
  await docClient.send(new PutCommand(params));
  return params.Item;
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User object or null
 */
async function getUserById(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId }
  };
  
  const result = await docClient.send(new GetCommand(params));
  return result.Item || null;
}

/**
 * Get user by email
 * Uses scan for now - will use GSI in production
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
async function getUserByEmail(email) {
  // For now, use scan (not efficient but works without GSI)
  // In production, create EmailIndex GSI
  const params = {
    TableName: USERS_TABLE,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  
  const result = await docClient.send(new ScanCommand(params));
  return result.Items?.[0] || null;
}

/**
 * Update user login time
 * @param {string} userId - User ID
 */
async function updateUserLogin(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'SET lastLogin = :now',
    ExpressionAttributeValues: {
      ':now': new Date().toISOString()
    }
  };
  
  await docClient.send(new UpdateCommand(params));
}

/**
 * Update user XP and level
 * @param {string} userId - User ID
 * @param {number} xpToAdd - XP to add
 */
async function updateUserXP(userId, xpToAdd) {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'SET totalXP = totalXP + :xp, #level = :level',
    ExpressionAttributeNames: {
      '#level': 'level'
    },
    ExpressionAttributeValues: {
      ':xp': xpToAdd,
      ':level': Math.floor(xpToAdd / 100) + 1 // Simple level calculation
    }
  };
  
  await docClient.send(new UpdateCommand(params));
}

/**
 * ========================================
 * CHAT HISTORY OPERATIONS
 * ========================================
 */

/**
 * Save chat
 * @param {string} userId - User ID
 * @param {string} chatId - Chat ID
 * @param {Array} messages - Array of message objects
 * @param {string} title - Chat title
 * @returns {Object} Saved chat object
 */
async function saveChat(userId, chatId, messages, title) {
  const timestamp = Date.now(); // Unix timestamp in milliseconds
  const createdAt = new Date().toISOString();
  
  const params = {
    TableName: CHAT_TABLE,
    Item: {
      userId,
      timestamp, // Sort key (Number)
      chatId,
      messages,
      title: title || (messages[0]?.text?.substring(0, 40) + '...' || 'New Chat'),
      createdAt,
      updatedAt: createdAt
    }
  };
  
  await docClient.send(new PutCommand(params));
  return params.Item;
}

/**
 * Get all chats for user
 * @param {string} userId - User ID
 * @returns {Array} Array of chat objects
 */
async function getUserChats(userId) {
  const params = {
    TableName: CHAT_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false // Most recent first
  };
  
  const result = await docClient.send(new QueryCommand(params));
  return result.Items || [];
}

/**
 * Get specific chat
 * @param {string} userId - User ID
 * @param {number} timestamp - Chat timestamp (Unix timestamp in milliseconds)
 * @returns {Object|null} Chat object or null
 */
async function getChat(userId, timestamp) {
  const params = {
    TableName: CHAT_TABLE,
    Key: { userId, timestamp: Number(timestamp) }
  };
  
  const result = await docClient.send(new GetCommand(params));
  return result.Item || null;
}

/**
 * Delete chat
 * @param {string} userId - User ID
 * @param {number} timestamp - Chat timestamp (Unix timestamp in milliseconds)
 */
async function deleteChat(userId, timestamp) {
  const params = {
    TableName: CHAT_TABLE,
    Key: { userId, timestamp: Number(timestamp) }
  };
  
  await docClient.send(new DeleteCommand(params));
}

/**
 * ========================================
 * LEARNING PROGRESS OPERATIONS
 * ========================================
 */

/**
 * Save topic progress
 * @param {string} userId - User ID
 * @param {string} topicId - Topic/Lesson ID
 * @param {Object} progressData - Progress data
 * @returns {Object} Saved progress object
 */
async function saveProgress(userId, topicId, progressData) {
  const params = {
    TableName: PROGRESS_TABLE,
    Item: {
      userId,
      lessonId: topicId, // Sort key is lessonId
      completed: progressData.completed || false,
      xpEarned: progressData.xpEarned || 0,
      completedAt: progressData.completed ? new Date().toISOString() : null,
      practiceAttempts: progressData.practiceAttempts || 0,
      lastAccessed: new Date().toISOString()
    }
  };
  
  await docClient.send(new PutCommand(params));
  return params.Item;
}

/**
 * Get all progress for user
 * @param {string} userId - User ID
 * @returns {Array} Array of progress objects
 */
async function getUserProgress(userId) {
  const params = {
    TableName: PROGRESS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
  
  const result = await docClient.send(new QueryCommand(params));
  return result.Items || [];
}

/**
 * Get specific topic progress
 * @param {string} userId - User ID
 * @param {string} topicId - Topic/Lesson ID
 * @returns {Object|null} Progress object or null
 */
async function getTopicProgress(userId, topicId) {
  const params = {
    TableName: PROGRESS_TABLE,
    Key: { userId, lessonId: topicId }
  };
  
  const result = await docClient.send(new GetCommand(params));
  return result.Item || null;
}

module.exports = {
  // User operations
  createUser,
  getUserById,
  getUserByEmail,
  updateUserLogin,
  updateUserXP,
  
  // Chat operations
  saveChat,
  getUserChats,
  getChat,
  deleteChat,
  
  // Progress operations
  saveProgress,
  getUserProgress,
  getTopicProgress
};
