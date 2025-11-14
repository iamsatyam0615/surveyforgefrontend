import { Theme } from '@/themes/presets';

export const applyThemeStyles = (theme: Theme) => {
  return {
    container: `min-h-screen transition-all duration-300 ${getFontClass(theme.font)} ${getBackgroundClass(theme)}`,
    card: `bg-white shadow-xl ${theme.rounded} p-8 transition-all`,
    cardDark: `shadow-xl ${theme.rounded} p-8 transition-all`,
    button: getButtonClass(theme),
    input: `w-full px-4 py-3 border-2 ${theme.rounded} focus:outline-none focus:ring-2 transition-all`,
    heading: `text-4xl font-bold mb-4`,
    subheading: `text-xl mb-6`,
    text: `text-base`,
  };
};

export const getBackgroundClass = (theme: Theme): string => {
  if (theme.gradient && theme.gradientFrom && theme.gradientTo) {
    return `bg-gradient-to-br`;
  }
  return '';
};

export const getBackgroundStyle = (theme: Theme): React.CSSProperties => {
  if (theme.gradient && theme.gradientFrom && theme.gradientTo) {
    return {
      background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
    };
  }
  return {
    backgroundColor: theme.background,
  };
};

export const getButtonClass = (theme: Theme): string => {
  const base = `px-6 py-3 font-semibold ${theme.rounded} transition-all duration-200 transform hover:scale-105`;
  
  switch (theme.buttonStyle) {
    case 'filled':
      return `${base} text-white shadow-lg hover:shadow-xl`;
    case 'outline':
      return `${base} bg-transparent border-2 hover:bg-opacity-10`;
    case 'soft':
      return `${base} text-white shadow-md hover:shadow-lg`;
    default:
      return base;
  }
};

export const getButtonStyle = (theme: Theme): React.CSSProperties => {
  switch (theme.buttonStyle) {
    case 'filled':
      return {
        backgroundColor: theme.primary,
        color: '#FFFFFF',
      };
    case 'outline':
      return {
        borderColor: theme.primary,
        color: theme.primary,
      };
    case 'soft':
      return {
        backgroundColor: theme.primary,
        color: '#FFFFFF',
        opacity: 0.9,
      };
    default:
      return {};
  }
};

export const getTextStyle = (theme: Theme): React.CSSProperties => {
  return {
    color: theme.text,
  };
};

export const getAccentStyle = (theme: Theme): React.CSSProperties => {
  return {
    color: theme.accent,
  };
};

export const getInputStyle = (theme: Theme): React.CSSProperties => {
  return {
    borderColor: theme.primary,
    color: theme.text,
  };
};

export const getCardStyle = (theme: Theme): React.CSSProperties => {
  if (theme.background === '#0F172A' || theme.background.includes('rgb(15')) {
    return {
      backgroundColor: '#1E293B',
      color: theme.text,
    };
  }
  return {
    backgroundColor: '#FFFFFF',
    color: theme.text,
  };
};

export const getFontClass = (fontName: string): string => {
  return `font-${fontName.toLowerCase().replace(/\s+/g, '-')}`;
};

export const loadGoogleFont = (fontName: string) => {
  const fontFamily = fontName.replace(/\s+/g, '+');
  const linkId = `google-font-${fontFamily}`;
  
  // Check if font is already loaded
  if (document.getElementById(linkId)) return;
  
  const link = document.createElement('link');
  link.id = linkId;
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const getPatternStyle = (theme: Theme): React.CSSProperties => {
  if (!theme.pattern || theme.pattern === 'none') return {};
  
  switch (theme.pattern) {
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${theme.accent}20 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      };
    case 'waves':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${theme.accent}20' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      };
    default:
      return {};
  }
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};
