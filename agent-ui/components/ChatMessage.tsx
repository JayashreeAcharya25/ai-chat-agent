import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import styles from '@/styles/module/ChatMessage.module.css';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export default function ChatMessage({ content, sender, timestamp }: ChatMessageProps) {
  return (
    <div className={`${styles.messageContainer} ${styles[sender]}`}>
      <div className={styles.message}>
        <div className={styles.content}><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></div>
        <div className={styles.timestamp}>
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}