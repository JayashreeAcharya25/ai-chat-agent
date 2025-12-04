export const theme = {
  colors: {
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed'
    },
    background: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      sidebar: 'rgba(0, 0, 0, 0.8)',
      chatArea: 'rgba(0, 0, 0, 0.4)',
      card: 'rgba(0, 0, 0, 0.6)',
      input: 'rgba(255, 255, 255, 0.1)',
      button: 'rgba(255, 255, 255, 0.1)'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.6)',
      disabled: '#888888',
      sidebar: '#cccccc',
      body: '#f7f7f7bf',       // Paragraph text
      link: 'rgba(167, 139, 250, 1)',          // Purple links
    },
    border: {
      light: 'rgba(255, 255, 255, 0.2)',
      card: 'rgba(255, 255, 255, 0.1)'
    },
    gradients: {
      research: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      travel: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
      study: 'linear-gradient(135deg, #a8edea, #fed6e3)'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px'
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px'
  }
} as const;

export type Theme = typeof theme;