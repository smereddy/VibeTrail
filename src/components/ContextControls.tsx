import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { VibeContext } from '../types';

/**
 * Context toggle options
 */
interface ContextOption {
    id: 'indoor' | 'outdoor' | 'hybrid' | 'auto';
    label: string;
    icon: string;
    description: string;
    color: string;
}

const CONTEXT_OPTIONS: ContextOption[] = [
    {
        id: 'auto',
        label: 'Auto',
        icon: '🤖',
        description: 'Let AI detect the best context',
        color: '#6B7280'
    },
    {
        id: 'indoor',
        label: 'Indoor',
        icon: '🏠',
        description: 'Cozy indoor experiences',
        color: '#8B5A3C'
    },
    {
        id: 'outdoor',
        label: 'Outdoor',
        icon: '🌳',
        description: 'Fresh outdoor adventures',
        color: '#2E7D32'
    },
    {
        id: 'hybrid',
        label: 'Hybrid',
        icon: '🌤️',
        description: 'Mix of indoor and outdoor',
        color: '#5E35B1'
    }
];

/**
 * Weather information
 */
interface WeatherInfo {
    condition: string;
    temperature: number;
    icon: string;
    description: string;
}

/**
 * Time of day information
 */
interface TimeInfo {
    period: 'morning' | 'afternoon' | 'evening' | 'night';
    icon: string;
    description: string;
}

/**
 * Props for ContextControls component
 */
interface ContextControlsProps {
    currentContext?: VibeContext;
    onContextChange?: (context: VibeContext) => void;
    showWeather?: boolean;
    showTime?: boolean;
    className?: string;
}

/**
 * Context controls component with toggle buttons and indicators
 */
export const ContextControls: React.FC<ContextControlsProps> = ({
    currentContext,
    onContextChange,
    showWeather = true,
    showTime = true,
    className = ''
}) => {
    const { updateThemeFromVibeContext } = useTheme();
    const [selectedContext, setSelectedContext] = useState<'indoor' | 'outdoor' | 'hybrid' | 'auto'>('auto');
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(null);

    /**
     * Get current time information
     */
    const getCurrentTimeInfo = (): TimeInfo => {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            return {
                period: 'morning',
                icon: '🌅',
                description: 'Morning vibes'
            };
        } else if (hour >= 12 && hour < 17) {
            return {
                period: 'afternoon',
                icon: '☀️',
                description: 'Afternoon energy'
            };
        } else if (hour >= 17 && hour < 21) {
            return {
                period: 'evening',
                icon: '🌆',
                description: 'Evening atmosphere'
            };
        } else {
            return {
                period: 'night',
                icon: '🌙',
                description: 'Night time mood'
            };
        }
    };

    /**
     * Mock weather data (in real app, this would come from weather API)
     */
    const getMockWeather = (): WeatherInfo => {
        const conditions = [
            { condition: 'sunny', temperature: 72, icon: '☀️', description: 'Perfect for outdoor activities' },
            { condition: 'cloudy', temperature: 65, icon: '☁️', description: 'Great for indoor/outdoor mix' },
            { condition: 'rainy', temperature: 58, icon: '🌧️', description: 'Perfect for cozy indoor time' },
            { condition: 'partly-cloudy', temperature: 68, icon: '⛅', description: 'Good for flexible plans' }
        ];
        
        return conditions[Math.floor(Math.random() * conditions.length)];
    };

    /**
     * Handle context selection
     */
    const handleContextSelect = (contextId: 'indoor' | 'outdoor' | 'hybrid' | 'auto') => {
        setSelectedContext(contextId);
        
        let newContext: VibeContext = {
            ...currentContext,
            timeOfDay: timeInfo?.period,
            season: getCurrentSeason()
        };

        // Set context based on selection
        if (contextId === 'indoor') {
            newContext = { ...newContext, isIndoor: true, isOutdoor: false, isHybrid: false };
        } else if (contextId === 'outdoor') {
            newContext = { ...newContext, isIndoor: false, isOutdoor: true, isHybrid: false };
        } else if (contextId === 'hybrid') {
            newContext = { ...newContext, isIndoor: false, isOutdoor: false, isHybrid: true };
        } else {
            // Auto mode - let AI decide or use weather hints
            if (weather?.condition === 'rainy') {
                newContext = { ...newContext, isIndoor: true, isOutdoor: false, isHybrid: false };
            } else if (weather?.condition === 'sunny') {
                newContext = { ...newContext, isIndoor: false, isOutdoor: true, isHybrid: false };
            } else {
                newContext = { ...newContext, isIndoor: false, isOutdoor: false, isHybrid: true };
            }
        }

        // Update theme and notify parent
        updateThemeFromVibeContext(newContext);
        onContextChange?.(newContext);
    };

    /**
     * Get current season
     */
    const getCurrentSeason = (): 'spring' | 'summer' | 'fall' | 'winter' => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    };

    /**
     * Initialize time and weather info
     */
    useEffect(() => {
        setTimeInfo(getCurrentTimeInfo());
        setWeather(getMockWeather());

        // Update time info every minute
        const timeInterval = setInterval(() => {
            setTimeInfo(getCurrentTimeInfo());
        }, 60000);

        return () => clearInterval(timeInterval);
    }, []);

    return (
        <div className={`context-controls ${className}`}>
            {/* Context Toggle Buttons */}
            <div className="context-toggles mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Experience Type</h3>
                <div className="flex flex-wrap gap-2">
                    {CONTEXT_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleContextSelect(option.id)}
                            className={`
                                flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200
                                ${selectedContext === option.id
                                    ? 'border-current bg-opacity-10 font-medium shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                            style={{
                                color: selectedContext === option.id ? option.color : '#6B7280',
                                backgroundColor: selectedContext === option.id ? `${option.color}15` : 'transparent'
                            }}
                        >
                            <span className="text-lg">{option.icon}</span>
                            <span className="text-sm">{option.label}</span>
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {CONTEXT_OPTIONS.find(opt => opt.id === selectedContext)?.description}
                </p>
            </div>

            {/* Weather and Time Indicators */}
            <div className="context-indicators flex flex-wrap gap-4">
                {/* Time Indicator */}
                {showTime && timeInfo && (
                    <div className="time-indicator flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-lg">{timeInfo.icon}</span>
                        <div>
                            <div className="text-sm font-medium text-gray-800 capitalize">
                                {timeInfo.period}
                            </div>
                            <div className="text-xs text-gray-500">
                                {timeInfo.description}
                            </div>
                        </div>
                    </div>
                )}

                {/* Weather Indicator */}
                {showWeather && weather && (
                    <div className="weather-indicator flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <span className="text-lg">{weather.icon}</span>
                        <div>
                            <div className="text-sm font-medium text-gray-800">
                                {weather.temperature}°F
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                                {weather.condition}
                            </div>
                        </div>
                    </div>
                )}

                {/* Season Indicator */}
                <div className="season-indicator flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-lg">
                        {getCurrentSeason() === 'spring' && '🌸'}
                        {getCurrentSeason() === 'summer' && '☀️'}
                        {getCurrentSeason() === 'fall' && '🍂'}
                        {getCurrentSeason() === 'winter' && '❄️'}
                    </span>
                    <div>
                        <div className="text-sm font-medium text-gray-800 capitalize">
                            {getCurrentSeason()}
                        </div>
                        <div className="text-xs text-gray-500">
                            Season
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Hint */}
            {weather && (
                <div className="context-hint mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-0.5">💡</span>
                        <div>
                            <div className="text-sm font-medium text-blue-800">
                                Context Suggestion
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                                {weather.description}
                                {selectedContext === 'auto' && ' (Auto mode active)'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 