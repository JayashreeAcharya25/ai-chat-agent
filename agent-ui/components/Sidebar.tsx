import React, { useState, useEffect } from 'react';
import { Search, Library, Plus, Settings, User, Rotate3D, Pencil, Share, Trash, LayoutTemplate, MessageCircleQuestionMark } from 'lucide-react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import styles from '@/styles/module/Sidebar.module.css';

interface Conversation {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  currentConversationId: string | null;
}

export default function Sidebar({ onNewChat, onSelectConversation, currentConversationId }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState<{element: HTMLElement, convId: string} | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/conversations`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleNewChat = () => {
    onNewChat();
    fetchConversations();
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      fetchConversations();
      setEditingChat(null);
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/conversations/${id}`, {
        method: 'DELETE'
      });
      fetchConversations();
      setShowMenu(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleShare = (id: string) => {
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/chat/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
    setShowMenu(null);
  };

  const startEdit = (conv: Conversation) => {
    setEditingChat(conv.id);
    setEditName(conv.name);
    setShowMenu(null);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span><Rotate3D /></span>
      </div>

      <button className={styles.menuItem} onClick={handleNewChat}>
        <Plus size={16} />
        New chat
      </button>

      <div className={styles.menuItem}>
        <Search size={16} />
        Search chat
      </div>
      <div className={styles.menuItem}>
        <Library size={16} />
        Library
      </div>

      <div className={styles.chatsSection}>
        <div className={styles.sectionTitle}>Chats</div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.chatItem} ${currentConversationId === conv.id ? styles.active : ''}`}
            onMouseEnter={() => setHoveredChat(conv.id)}
            onMouseLeave={() => setHoveredChat(null)}
          >
            {editingChat === conv.id ? (
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRename(conv.id, editName)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename(conv.id, editName)}
                autoFocus
                size="small"
                variant="outlined"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    color: 'inherit',
                    '& fieldset': {
                      borderColor: 'transparent'
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '0px',
                    fontSize: 14
                  }
                }}
              />
            ) : (
              <span 
                onClick={() => onSelectConversation(conv.id)} 
                style={{ 
                  flex: 1, 
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginRight: '8px',
                  minWidth: 0
                }}
              >
                {conv.name}
              </span>
            )}
            {(hoveredChat === conv.id || (showMenu && showMenu.convId === conv.id)) && editingChat !== conv.id && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu({element: e.currentTarget, convId: conv.id});
                }}
                sx={{ color: 'inherit' }}
              >
                <MoreHoriz fontSize="small" />
              </IconButton>
            )}
            <Menu
              anchorEl={showMenu?.element}
              open={Boolean(showMenu && showMenu.convId === conv.id)}
              onClose={() => setShowMenu(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  bgcolor: '#2a2a2a',
                  color: 'white',
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      bgcolor: '#3a3a3a'
                    }
                  }
                }
              }}
            >
              <MenuItem onClick={() => {
                startEdit(conv);
                setShowMenu(null);
              }}>
                <ListItemIcon>
                  <Pencil size={14} color='white' />
                </ListItemIcon>
                <ListItemText>Rename</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleDelete(conv.id);
                setShowMenu(null);
              }}>
                <ListItemIcon>
                  <Trash size={14} color='white' />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleShare(conv.id);
                setShowMenu(null);
              }}>
                <ListItemIcon>
                  <Share size={14} color='white' />
                </ListItemIcon>
                <ListItemText>Share</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        ))}
      </div>

      <div className={styles.pagesSection}>
        <div className={styles.sectionTitle}>Pages</div>
        <div className={styles.templateItem}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span><LayoutTemplate size={16}/></span>
            Templates
          </div>
          <span className={styles.newBadge}>NEW</span>
        </div>
        <div className={styles.menuItem}>
          <span><MessageCircleQuestionMark size={16}/></span>
          Helps
        </div>
        <div className={styles.menuItem}>
          <Settings size={16} />
          Settings
        </div>
        <div className={styles.menuItem}>
          <User size={16} />
          Manage account
        </div>
      </div>
    </div>
  );
}