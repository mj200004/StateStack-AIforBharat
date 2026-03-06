// Shared constants for the application

// API Configuration
// Production API URL (AWS Lambda)
export const API_URL = 'https://7axig9oz47.execute-api.us-east-1.amazonaws.com/dev';

// Local development URL (uncomment for local testing)
// export const API_URL = 'http://localhost:3001';

// LocalStorage key for learning progress
export const STORAGE_KEY = 'learning_progress';

// Topic XP values (indexed by topic ID - 1)
export const TOPIC_XP_VALUES = [
  100, // Topic 1: Variables & Data Types
  80,  // Topic 2: Operators & Expressions
  90,  // Topic 3: Conditionals
  100, // Topic 4: Loops
  120, // Topic 5: Functions
  130, // Topic 6: Arrays
  130, // Topic 7: Objects
  90,  // Topic 8: Strings
  140, // Topic 9: DOM
  120, // Topic 10: Events
  110, // Topic 11: Arrow Functions
  100, // Topic 12: Destructuring
  160, // Topic 13: Async/Await
  150, // Topic 14: Fetch API
  100, // Topic 15: Error Handling
  110, // Topic 16: Local Storage
  90,  // Topic 17: JSON
  120, // Topic 18: Modules
  100, // Topic 19: Debugging
  130  // Topic 20: Best Practices
];
