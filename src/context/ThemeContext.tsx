import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VibeContext } from '../types';

/**
 * Theme configuration for different vibe contexts
 */
export interface ThemeConfig {
    id: string;
    name: string;
    colors: {
        primary: string;
        primaryDark: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        success: string;
        warning: string;
        error: string;
    };
    gradients: {
        primary: string;
        background: string;
        card: string;
    };
    shadows: {
        sm: string;
        md: string;
        lg: string;
    };
    typography: {
        fontFamily: string;
        headingWeight: string;
        bodyWeight: string;
    };
    animation: {
        duration: string;
        easing: string;
    };
}

/**
 * Predefined themes for different contexts
 */
const THEMES: { [key: string]: ThemeConfig } = {
    indoor: {
        id: 'indoor',
        name: 'Cozy Indoor',
        colors: {
            primary: '#8B5A3C',      // Warm brown
            primaryDark: '#6B4423',   // Darker brown
            secondary: '#D4A574',     // Light caramel
            accent: '#E67E22',        // Warm orange
            background: '#FFF8F3',    // Cream white
            surface: '#FFFFFF',       // Pure white
            text: '#2C1810',          // Dark brown
            textSecondary: '#8B6F47', // Medium brown
            border: '#E8D5C4',        // Light brown
            success: '#27AE60',       // Green
            warning: '#F39C12',       // Orange
            error: '#E74C3C'          // Red
        },
        gradients: {
            primary: 'linear-gradient(135deg, #8B5A3C 0%, #D4A574 100%)',
            background: 'linear-gradient(180deg, #FFF8F3 0%, #F4E8D8 100%)',
            card: 'linear-gradient(145deg, #FFFFFF 0%, #FFF8F3 100%)'
        },
        shadows: {
            sm: '0 2px 4px rgba(139, 90, 60, 0.1)',
            md: '0 4px 12px rgba(139, 90, 60, 0.15)',
            lg: '0 8px 24px rgba(139, 90, 60, 0.2)'
        },
        typography: {
            fontFamily: '"Inter", "Georgia", serif',
            headingWeight: '600',
            bodyWeight: '400'
        },
        animation: {
            duration: '0.3s',
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    },
    outdoor: {
        id: 'outdoor',
        name: 'Fresh Outdoor',
        colors: {
            primary: '#2E7D32',       // Forest green
            primaryDark: '#1B5E20',   // Darker green
            secondary: '#66BB6A',     // Light green
            accent: '#4CAF50',        // Bright green
            background: '#F1F8E9',    // Very light green
            surface: '#FFFFFF',       // Pure white
            text: '#1B5E20',          // Dark green
            textSecondary: '#388E3C', // Medium green
            border: '#C8E6C9',        // Light green border
            success: '#4CAF50',       // Green
            warning: '#FF9800',       // Orange
            error: '#F44336'          // Red
        },
        gradients: {
            primary: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
            background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E8 100%)',
            card: 'linear-gradient(145deg, #FFFFFF 0%, #F1F8E9 100%)'
        },
        shadows: {
            sm: '0 2px 4px rgba(46, 125, 50, 0.1)',
            md: '0 4px 12px rgba(46, 125, 50, 0.15)',
            lg: '0 8px 24px rgba(46, 125, 50, 0.2)'
        },
        typography: {
            fontFamily: '"Inter", "Helvetica Neue", sans-serif',
            headingWeight: '600',
            bodyWeight: '400'
        },
        animation: {
            duration: '0.4s',
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
    },
    hybrid: {
        id: 'hybrid',
        name: 'Balanced Hybrid',
        colors: {
            primary: '#5E35B1',       // Deep purple
            primaryDark: '#4527A0',   // Darker purple
            secondary: '#9575CD',     // Light purple
            accent: '#7E57C2',        // Medium purple
            background: '#FAF7FF',    // Very light purple
            surface: '#FFFFFF',       // Pure white
            text: '#4A148C',          // Dark purple
            textSecondary: '#7B1FA2', // Medium purple
            border: '#E1BEE7',        // Light purple border
            success: '#4CAF50',       // Green
            warning: '#FF9800',       // Orange
            error: '#F44336'          // Red
        },
        gradients: {
            primary: 'linear-gradient(135deg, #5E35B1 0%, #9575CD 100%)',
            background: 'linear-gradient(180deg, #FAF7FF 0%, #F3E5F5 100%)',
            card: 'linear-gradient(145deg, #FFFFFF 0%, #FAF7FF 100%)'
        },
        shadows: {
            sm: '0 2px 4px rgba(94, 53, 177, 0.1)',
            md: '0 4px 12px rgba(94, 53, 177, 0.15)',
            lg: '0 8px 24px rgba(94, 53, 177, 0.2)'
        },
        typography: {
            fontFamily: '"Inter", "Roboto", sans-serif',
            headingWeight: '600',
            bodyWeight: '400'
        },
        animation: {
            duration: '0.35s',
            easing: 'cubic-bezier(0.4, 0, 0.6, 1)'
        }
    },
    default: {
        id: 'default',
        name: 'Default',
        colors: {
            primary: '#3B82F6',       // Blue
            primaryDark: '#2563EB',   // Darker blue
            secondary: '#60A5FA',     // Light blue
            accent: '#1D4ED8',        // Bright blue
            background: '#F8FAFC',    // Very light gray
            surface: '#FFFFFF',       // Pure white
            text: '#1E293B',          // Dark gray
            textSecondary: '#64748B', // Medium gray
            border: '#E2E8F0',        // Light gray border
            success: '#10B981',       // Green
            warning: '#F59E0B',       // Orange
            error: '#EF4444'          // Red
        },
        gradients: {
            primary: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
            card: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)'
        },
        shadows: {
            sm: '0 2px 4px rgba(59, 130, 246, 0.1)',
            md: '0 4px 12px rgba(59, 130, 246, 0.15)',
            lg: '0 8px 24px rgba(59, 130, 246, 0.2)'
        },
        typography: {
            fontFamily: '"Inter", system-ui, sans-serif',
            headingWeight: '600',
            bodyWeight: '400'
        },
        animation: {
            duration: '0.3s',
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    }
};

/**
 * Context type for theme management
 */
interface ThemeContextType {
    currentTheme: ThemeConfig;
    setTheme: (themeId: string) => void;
    updateThemeFromVibeContext: (vibeContext: VibeContext) => void;
    availableThemes: ThemeConfig[];
    isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider component
 */
interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
    children, 
    defaultTheme = 'default' 
}) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(THEMES[defaultTheme]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    /**
     * Update theme with smooth transition
     */
    const setTheme = (themeId: string) => {
        if (THEMES[themeId] && themeId !== currentTheme.id) {
            setIsTransitioning(true);
            
            // Start transition
            setTimeout(() => {
                setCurrentTheme(THEMES[themeId]);
                
                // End transition after theme is applied
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100);
            }, 50);
        }
    };

    /**
     * Automatically update theme based on vibe context
     */
    const updateThemeFromVibeContext = (vibeContext: VibeContext) => {
        let newThemeId = 'default';

        // Determine theme based on context with priority
        if (vibeContext.isIndoor && !vibeContext.isOutdoor) {
            newThemeId = 'indoor';
        } else if (vibeContext.isOutdoor && !vibeContext.isIndoor) {
            newThemeId = 'outdoor';
        } else if (vibeContext.isHybrid || (vibeContext.isIndoor && vibeContext.isOutdoor)) {
            newThemeId = 'hybrid';
        }

        console.log('🎨 Theme Context: Updating theme to', newThemeId, 'based on vibe:', vibeContext);
        setTheme(newThemeId);
    };

    /**
     * Apply CSS custom properties for the current theme
     */
    useEffect(() => {
        const root = document.documentElement;
        const theme = currentTheme;

        // Apply color variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Apply gradient variables
        Object.entries(theme.gradients).forEach(([key, value]) => {
            root.style.setProperty(`--gradient-${key}`, value);
        });

        // Apply shadow variables
        Object.entries(theme.shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });

        // Apply typography variables
        Object.entries(theme.typography).forEach(([key, value]) => {
            root.style.setProperty(`--typography-${key}`, value);
        });

        // Apply animation variables
        Object.entries(theme.animation).forEach(([key, value]) => {
            root.style.setProperty(`--animation-${key}`, value);
        });

        // Apply theme class to body for additional styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme.id}`);

        console.log('🎨 Applied theme:', theme.name);
    }, [currentTheme]);

    const contextValue: ThemeContextType = {
        currentTheme,
        setTheme,
        updateThemeFromVibeContext,
        availableThemes: Object.values(THEMES),
        isTransitioning
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

/**
 * Hook to get CSS custom property values
 */
export const useThemeStyles = () => {
    const { currentTheme } = useTheme();
    
    return {
        colors: currentTheme.colors,
        gradients: currentTheme.gradients,
        shadows: currentTheme.shadows,
        typography: currentTheme.typography,
        animation: currentTheme.animation,
        
        // Utility functions
        getColor: (colorName: keyof ThemeConfig['colors']) => currentTheme.colors[colorName],
        getGradient: (gradientName: keyof ThemeConfig['gradients']) => currentTheme.gradients[gradientName],
        getShadow: (shadowName: keyof ThemeConfig['shadows']) => currentTheme.shadows[shadowName],
    };
}; 