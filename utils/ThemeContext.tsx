import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'cyberpunk' | 'brand';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('cyberpunk');

    const toggleTheme = () => {
        setTheme(prev => prev === 'cyberpunk' ? 'brand' : 'cyberpunk');
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Sync with user's specific request for "Logo Mode"
    useEffect(() => {
        console.log(`Theme switched to: ${theme}`);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
