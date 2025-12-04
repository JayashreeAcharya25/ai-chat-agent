import React from 'react';
import { Target, Globe, BookOpen, Wrench } from 'lucide-react';
import styles from '@/styles/module/WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onSendMessage: (msg: string) => void;
  message: string;
  setMessage: (message: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
}

export default function WelcomeScreen({ onSendMessage, message, setMessage, onKeyPress, loading }: WelcomeScreenProps) {
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className={styles.chatArea}>
      <div className={styles.welcomeText}>
        What are you thinking about today?
      </div>
      
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ask anything"
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button className={styles.toolsBtn}>
          <Wrench size={16} />
          Tools
        </button>
      </div>
      
      <div className={styles.agentCards}>
        <div className={styles.agentCard}>
          <div className={`${styles.cardIcon} ${styles.researchIcon}`}>
            <Target size={24} />
          </div>
          <div className={styles.cardTitle}>Research</div>
          <div className={styles.cardDescription}>
            Create a comprehensive report of any task company.
          </div>
          <button className={styles.goBtn}>Go</button>
        </div>
        
        <div className={styles.agentCard}>
          <div className={`${styles.cardIcon} ${styles.travelIcon}`}>
            <Globe size={24} />
          </div>
          <div className={styles.cardTitle}>Travel</div>
          <div className={styles.cardDescription}>
            Plan a detailed trip to create and travel Hawaii.
          </div>
          <button className={styles.goBtn}>Go</button>
        </div>
        
        <div className={styles.agentCard}>
          <div className={`${styles.cardIcon} ${styles.studyIcon}`}>
            <BookOpen size={24} />
          </div>
          <div className={styles.cardTitle}>Study</div>
          <div className={styles.cardDescription}>
            Create a study plan for a history test and what works.
          </div>
          <button className={styles.goBtn}>Go</button>
        </div>
      </div>
    </div>
  );
}