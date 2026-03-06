import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import { STORAGE_KEY, TOPIC_XP_VALUES } from '../utils/constants';
import { saveProgress, getCurrentUser } from '../utils/api';
import './Lesson.css';

// Lesson content data
const LESSONS = {
  1: {
    title: "Variables & Data Types",
    explanation: `Variables are containers that store data values. Think of them as labeled boxes where you can put different types of information.

In JavaScript, we have three ways to declare variables:
• let - for values that can change
• const - for values that stay the same
• var - older way (avoid using this)

JavaScript has several data types:
• String: Text like "Hello"
• Number: Numbers like 42 or 3.14
• Boolean: true or false
• Undefined: Variable declared but not assigned
• Null: Intentionally empty value`,
    example: `// Declaring variables
let age = 25;           // Number
const name = "Alice";   // String
let isStudent = true;   // Boolean

// You can change 'let' variables
age = 26;

// But you cannot change 'const' variables
// name = "Bob";  // This would cause an error!

console.log(name + " is " + age + " years old");`,
    practice: "Try creating variables for your own name, age, and whether you like coding (true/false). Then log them to the console."
  },
  2: {
    title: "Operators & Expressions",
    explanation: `Operators let you perform operations on values. They're like the math symbols you use in calculations.

Arithmetic Operators:
• + (addition), - (subtraction), * (multiplication), / (division)
• % (modulus - remainder), ** (exponentiation)

Comparison Operators:
• === (equal to), !== (not equal to)
• > (greater than), < (less than)
• >= (greater or equal), <= (less or equal)

Logical Operators:
• && (AND), || (OR), ! (NOT)`,
    example: `// Arithmetic
let sum = 10 + 5;        // 15
let product = 4 * 3;     // 12
let remainder = 10 % 3;  // 1

// Comparison
let isAdult = age >= 18;  // true or false
let isEqual = 5 === 5;    // true

// Logical
let canVote = age >= 18 && hasCitizenship;
let isWeekend = day === "Saturday" || day === "Sunday";`,
    practice: "Create two numbers and use different operators to add, subtract, multiply, and compare them."
  },
  3: {
    title: "Conditionals (if/else)",
    explanation: `Conditionals let your code make decisions. They're like choosing different paths based on conditions.

The if statement runs code only if a condition is true.
The else statement runs code if the condition is false.
The else if lets you check multiple conditions.`,
    example: `let temperature = 25;

if (temperature > 30) {
  console.log("It's hot outside!");
} else if (temperature > 20) {
  console.log("Nice weather!");
} else {
  console.log("It's cold!");
}

// Ternary operator (shorthand)
let message = age >= 18 ? "Adult" : "Minor";`,
    practice: "Write an if/else statement that checks if a number is positive, negative, or zero."
  },
  4: {
    title: "Loops (for/while)",
    explanation: `Loops let you repeat code multiple times without writing it over and over.

For Loop: Use when you know how many times to repeat
While Loop: Use when you repeat until a condition becomes false

Loops are perfect for:
• Processing arrays
• Counting
• Repeating actions`,
    example: `// For loop - count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}

// While loop - repeat until condition is false
let count = 0;
while (count < 3) {
  console.log("Loop " + count);
  count++;
}

// Loop through array
let fruits = ["apple", "banana", "orange"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}`,
    practice: "Create a for loop that prints numbers from 1 to 10, but only print even numbers."
  },
  5: {
    title: "Functions Basics",
    explanation: `Functions are reusable blocks of code that perform specific tasks. Think of them as recipes - you write them once and use them many times.

Benefits of functions:
• Reusability: Write once, use many times
• Organization: Keep code clean and structured
• Abstraction: Hide complex logic behind simple names

Functions can:
• Take inputs (parameters)
• Return outputs (return values)
• Be called multiple times`,
    example: `// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Calling the function
let message = greet("Alice");
console.log(message);  // "Hello, Alice!"

// Function with multiple parameters
function add(a, b) {
  return a + b;
}

let sum = add(5, 3);  // 8

// Function without return
function sayHello() {
  console.log("Hello!");
}`,
    practice: "Create a function that takes two numbers and returns their product (multiplication)."
  }
};

function Lesson({ user, setUser }) {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [userProgress, setUserProgress] = useState({ xp: 0, completedTopics: [] });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Load lesson content
  useEffect(() => {
    const lessonData = LESSONS[topicId];
    if (lessonData) {
      setLesson(lessonData);
    } else if (topicId >= 1 && topicId <= 20) {
      // Lesson exists in the path but content not yet available
      setLesson({
        title: `Lesson ${topicId} - Coming Soon`,
        explanation: `This lesson is currently being developed and will be available soon!\n\nIn the meantime, you can:\n• Review previous lessons\n• Practice with the Debug tool\n• Ask the AI assistant questions in the Chat`,
        example: `// Content coming soon!\nconsole.log("Stay tuned for this lesson!");`,
        practice: "Check back soon for practice exercises!"
      });
    } else {
      // Invalid lesson ID
      navigate('/learning-path');
    }
  }, [topicId, navigate]);

  // Load user progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProgress({
          xp: parsed.xp || 0,
          completedTopics: parsed.completedTopics || []
        });
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleMarkComplete = async () => {
    const topicIdNum = parseInt(topicId);
    
    // Read current progress from localStorage
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      xp: 0,
      completedTopics: []
    };
    
    // Check if already completed to prevent duplicate XP
    if (saved.completedTopics.some(t => t.id === topicIdNum)) {
      // Already completed, just navigate back
      navigate('/learning-path');
      return;
    }
    
    // Create new completion entry
    const newEntry = {
      id: topicIdNum,
      completedAt: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
    
    // Get XP for this topic
    const topicXP = TOPIC_XP_VALUES[topicIdNum - 1] || 100;
    
    // Update progress
    saved.completedTopics.push(newEntry);
    saved.xp += topicXP;
    
    // Save to localStorage FIRST
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    
    // Save to DynamoDB
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.userId) {
      try {
        await saveProgress(currentUser.userId, `topic-${topicIdNum}`, {
          completed: true,
          xpEarned: topicXP,
          practiceAttempts: 1
        });
        console.log('✅ Progress saved to DynamoDB');
      } catch (err) {
        console.error('Failed to save progress to DynamoDB:', err);
      }
    }
    
    // Then update state
    setUserProgress(saved);
    setEarnedXP(topicXP);
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleContinueLearning = () => {
    setShowSuccessModal(false);
    // Navigate to next lesson if available
    const nextLessonId = parseInt(topicId) + 1;
    if (nextLessonId <= 20) {
      navigate(`/lesson/${nextLessonId}`);
    } else {
      navigate('/learning-path');
    }
  };

  const handleBackToPath = () => {
    setShowSuccessModal(false);
    navigate('/learning-path');
  };

  const handleAskAI = () => {
    if (lesson) {
      localStorage.setItem('pendingQuestion', `I'm learning about ${lesson.title}. Can you help me understand it better?`);
      navigate('/chat');
    }
  };

  const handleTryInDebugger = () => {
    if (lesson) {
      // Store the practice starter code in localStorage
      localStorage.setItem('debugStarterCode', lesson.example);
      navigate('/debug');
    }
  };

  if (!lesson) {
    return <div>Loading...</div>;
  }

  const isCompleted = userProgress.completedTopics.some(t => t.id === parseInt(topicId));

  return (
    <div className="lesson-container">
      <nav className="navbar">
        <h2>🤖 AI Learning Assistant</h2>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/chat')}>Chat</button>
          <button onClick={() => navigate('/debug')}>Debug</button>
          <button onClick={() => navigate('/learning-path')}>Learning Path</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="lesson-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate('/learning-path')} className="breadcrumb-link">
            ← Back to Learning Path
          </button>
        </div>

        {/* Lesson Header */}
        <div className="lesson-header">
          <div className="lesson-number">Lesson {topicId}</div>
          <h1>{lesson.title}</h1>
          {isCompleted && <div className="completed-badge-large">✓ Completed</div>}
        </div>

        {/* Explanation Section */}
        <div className="lesson-section">
          <h2>📖 What You'll Learn</h2>
          <div className="explanation-box">
            {lesson.explanation.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {/* Code Example Section */}
        <div className="lesson-section">
          <h2>💻 Code Example</h2>
          <div className="code-box">
            <pre><code>{lesson.example}</code></pre>
          </div>
        </div>

        {/* Practice Section */}
        <div className="lesson-section">
          <h2>✏️ Practice Task</h2>
          <div className="practice-box">
            <p>{lesson.practice}</p>
            <div className="practice-hint">
              💡 Tip: Click "Try in Debugger" below to practice with the code example!
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="lesson-actions">
          <button className="action-btn secondary" onClick={handleTryInDebugger}>
            🐛 Try in Debugger
          </button>
          
          <button className="action-btn secondary" onClick={handleAskAI}>
            💬 Ask AI for Help
          </button>
          
          {!isCompleted ? (
            <button className="action-btn primary" onClick={handleMarkComplete}>
              ✓ Mark as Complete
            </button>
          ) : (
            <button className="action-btn completed" onClick={() => navigate('/learning-path')}>
              ← Return to Learning Path
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="lesson-navigation">
          {parseInt(topicId) > 1 && (
            <button 
              className="nav-btn prev"
              onClick={() => navigate(`/lesson/${parseInt(topicId) - 1}`)}
            >
              ← Previous Lesson
            </button>
          )}
          
          {parseInt(topicId) < 20 && (
            <button 
              className="nav-btn next"
              onClick={() => navigate(`/lesson/${parseInt(topicId) + 1}`)}
            >
              Next Lesson →
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        lessonTitle={lesson.title}
        xpEarned={earnedXP}
        onContinue={handleContinueLearning}
        onBackToPath={handleBackToPath}
      />
    </div>
  );
}

export default Lesson;
