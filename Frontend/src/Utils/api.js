/**
 * API Service Module
 * Handles all backend API calls for authentication, chat, and progress
 */

import { API_URL } from './constants';

/**
 * ========================================
 * AUTHENTICATION API
 * ========================================
 */

/**
 * Register a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data
 */
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  
  return data.user;
}

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  return data.user;
}

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export async function getUserProfile(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get user profile');
  }
  
  return data;
}

/**
 * ========================================
 * CHAT API
 * ========================================
 */

/**
 * Save chat to DynamoDB
 * @param {string} userId - User ID
 * @param {string} chatId - Chat ID
 * @param {Array} messages - Array of message objects
 * @param {string} title - Chat title
 * @returns {Promise<Object>} Saved chat data
 */
export async function saveChat(userId, chatId, messages, title) {
  const response = await fetch(`${API_URL}/chat/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, chatId, messages, title }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save chat');
  }
  
  return data.chat;
}

/**
 * Get all chats for user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of chat objects
 */
export async function getUserChats(userId) {
  const response = await fetch(`${API_URL}/chat/history/${userId}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get chats');
  }
  
  return data.chats;
}

/**
 * Get specific chat
 * @param {string} userId - User ID
 * @param {number} timestamp - Chat timestamp
 * @returns {Promise<Object>} Chat object
 */
export async function getChat(userId, timestamp) {
  const response = await fetch(`${API_URL}/chat/${userId}/${timestamp}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get chat');
  }
  
  return data;
}

/**
 * Delete chat
 * @param {string} userId - User ID
 * @param {number} timestamp - Chat timestamp
 * @returns {Promise<Object>} Success response
 */
export async function deleteChat(userId, timestamp) {
  const response = await fetch(`${API_URL}/chat/${userId}/${timestamp}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete chat');
  }
  
  return data;
}

/**
 * ========================================
 * PROGRESS API
 * ========================================
 */

/**
 * Save topic progress
 * @param {string} userId - User ID
 * @param {string} topicId - Topic/Lesson ID
 * @param {Object} progressData - Progress data
 * @returns {Promise<Object>} Saved progress data
 */
export async function saveProgress(userId, topicId, progressData) {
  const response = await fetch(`${API_URL}/progress/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, topicId, progressData }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save progress');
  }
  
  return data.progress;
}

/**
 * Get all progress for user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of progress objects
 */
export async function getUserProgress(userId) {
  const response = await fetch(`${API_URL}/progress/${userId}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get progress');
  }
  
  return data.progress;
}

/**
 * Get specific topic progress
 * @param {string} userId - User ID
 * @param {string} topicId - Topic/Lesson ID
 * @returns {Promise<Object|null>} Progress object or null
 */
export async function getTopicProgress(userId, topicId) {
  const response = await fetch(`${API_URL}/progress/${userId}/${topicId}`);
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get topic progress');
  }
  
  return data.progress;
}

/**
 * ========================================
 * HELPER FUNCTIONS
 * ========================================
 */

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Save current user to localStorage
 * @param {Object} user - User object
 */
export function saveCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Clear current user from localStorage
 */
export function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export function isLoggedIn() {
  return getCurrentUser() !== null;
}
