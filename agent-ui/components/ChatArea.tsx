import React, { useState, useEffect, useRef } from 'react';
import { Wrench } from 'lucide-react';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import styles from '@/styles/module/ChatArea.module.css';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

interface ChatAreaProps {
  conversationId: string | null;
  onNewConversation: (id: string | null) => void;
}

export default function ChatArea({ conversationId, onNewConversation }: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!conversationId) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/conversations/${conversationId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const currentMessage = message;
    setMessage('');
    
    const userMessage = {
      id: `temp-${Date.now()}`,
      content: currentMessage,
      sender: 'user' as const,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: currentMessage,
          conversation_id: conversationId 
        }),
      });
      
      const data = await response.json();
      
      if (!conversationId) {
        onNewConversation(data.conversation_id);
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(currentMessage);
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWelcomeMessage = async (msg: string) => {
    setMessage('');
    
    const userMessage = {
      id: `temp-${Date.now()}`,
      content: msg,
      sender: 'user' as const,
      timestamp: new Date().toISOString()
    };
    setMessages([userMessage]);
    setLoading(true);
    
    const tempConversationId = `temp-${Date.now()}`;
    onNewConversation(tempConversationId);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: msg,
          conversation_id: null 
        }),
      });
      
      const data = await response.json();
      // Update with conversation ID
      onNewConversation(data.conversation_id);
    } catch (error) {
      console.error('Error:', error);
      setMessage(msg);
      setMessages([]);
      // Reset to welcome screen on error
      onNewConversation(null);
    } finally {
      setLoading(false);
    }
  };

  if (!conversationId) {
    return <WelcomeScreen onSendMessage={handleWelcomeMessage} message={message} setMessage={setMessage} onKeyPress={handleKeyPress} loading={loading} />;
  }

  return (
    <div className={styles.chatArea}>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            content={msg.content}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
        {loading && (
          <div className={styles.loadingMessage}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
    </div>
  );
}