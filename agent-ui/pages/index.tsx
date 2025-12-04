import React, { useState, useEffect } from 'react';
import { User, Menu } from 'lucide-react';
import { Grid, Box, Drawer, useMediaQuery, useTheme, IconButton } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import styles from '@/styles/module/Dashboard.module.css';
import { theme } from '@/styles/theme/theme';

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    // Set CSS custom properties from theme
    const root = document.documentElement;
    root.style.setProperty('--bg-gradient', theme.colors.background.gradient);
    root.style.setProperty('--bg-sidebar', theme.colors.background.sidebar);
    root.style.setProperty('--bg-chat-area', theme.colors.background.chatArea);
    root.style.setProperty('--bg-card', theme.colors.background.card);
    root.style.setProperty('--bg-input', theme.colors.background.input);
    root.style.setProperty('--bg-button', theme.colors.background.button);
    root.style.setProperty('--primary-main', theme.colors.primary.main);
    root.style.setProperty('--text-primary', theme.colors.text.primary);
    root.style.setProperty('--text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--text-muted', theme.colors.text.muted);
    root.style.setProperty('--text-disabled', theme.colors.text.disabled);
    root.style.setProperty('--text-sidebar', theme.colors.text.sidebar);
    root.style.setProperty('--border-light', theme.colors.border.light);
    root.style.setProperty('--gradient-research', theme.colors.gradients.research);
    root.style.setProperty('--gradient-travel', theme.colors.gradients.travel);
    root.style.setProperty('--gradient-study', theme.colors.gradients.study);
    root.style.setProperty('--spacing-xs', theme.spacing.xs);
    root.style.setProperty('--spacing-sm', theme.spacing.sm);
    root.style.setProperty('--spacing-md', theme.spacing.md);
    root.style.setProperty('--spacing-lg', theme.spacing.lg);
    root.style.setProperty('--spacing-xl', theme.spacing.xl);
    root.style.setProperty('--spacing-xxl', theme.spacing.xxl);
    root.style.setProperty('--border-radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--border-radius-md', theme.borderRadius.md);
    root.style.setProperty('--border-radius-lg', theme.borderRadius.lg);
  }, []);

  const handleNewChat = () => {
    setCurrentConversationId(null);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleNewConversation = (id: string | null) => {
    setCurrentConversationId(id);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Sidebar 
      onNewChat={handleNewChat}
      onSelectConversation={handleSelectConversation}
      currentConversationId={currentConversationId}
    />
  );

  return (
    <Box className={styles.container}>
      <Grid container sx={{ height: '100vh', width: '100%' }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Grid size={{md: 2}}>
            {sidebarContent}
          </Grid>
        )}
        
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 280, backgroundColor: 'transparent' }
          }}
        >
          {sidebarContent}
        </Drawer>
        
        {/* Main Content */}
        <Grid size={{xs: 12, md: 10}}>
          <div className={styles.mainContent}>
            <div className={styles.topBar}>
              {isMobile && (
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{ color: 'white', mr: 2 }}
                >
                  <Menu />
                </IconButton>
              )}
              <div className={styles.agentTitle}>Zano</div>
              <button className={styles.signInBtn}>
                <User size={16} />
                Sign in
              </button>
            </div>
            
            <ChatArea 
              conversationId={currentConversationId}
              onNewConversation={handleNewConversation}
            />
              {/* <span className={styles.bottomLink}>AI Task Assistant</span> */}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}