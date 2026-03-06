import { useEffect } from 'react';
import './SuccessModal.css';

function SuccessModal({ show, onClose, lessonTitle, xpEarned, onContinue, onBackToPath }) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-icon">
          <div className="success-checkmark">✓</div>
        </div>
        
        <h2 className="success-modal-title">Lesson Completed!</h2>
        
        <div className="success-modal-content">
          <div className="success-lesson-name">{lessonTitle}</div>
          <div className="success-xp-earned">
            <span className="xp-icon">⚡</span>
            <span className="xp-amount">+{xpEarned} XP</span>
          </div>
          <p className="success-message">
            Great job! You've successfully completed this lesson.
          </p>
        </div>

        <div className="success-modal-actions">
          <button 
            onClick={onContinue} 
            className="success-btn secondary"
          >
            Continue Learning
          </button>
          <button 
            onClick={onBackToPath} 
            className="success-btn primary"
          >
            Back to Learning Path
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
