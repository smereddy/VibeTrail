import React, { useState, useEffect, useRef } from 'react';
import { useThemeStyles } from '../context/ThemeContext';
import { VibeContext } from '../types';

/**
 * Vibe pattern suggestions
 */
interface VibePattern {
    text: string;
    category: string;
    context: Partial<VibeContext>;
    popularity: number;
    tags: string[];
}

/**
 * Popular vibe patterns for auto-complete
 */
const POPULAR_VIBE_PATTERNS: VibePattern[] = [
    // Indoor patterns
    {
        text: "cozy coffee shop vibes",
        category: "Indoor",
        context: { isIndoor: true, timeOfDay: 'morning' },
        popularity: 95,
        tags: ['coffee', 'reading', 'work', 'casual']
    },
    {
        text: "quiet bookstore atmosphere",
        category: "Indoor",
        context: { isIndoor: true, timeOfDay: 'afternoon' },
        popularity: 88,
        tags: ['books', 'quiet', 'browsing', 'peaceful']
    },
    {
        text: "intimate jazz club evening",
        category: "Indoor",
        context: { isIndoor: true, timeOfDay: 'evening' },
        popularity: 82,
        tags: ['music', 'drinks', 'sophisticated', 'romantic']
    },
    {
        text: "movie night at home",
        category: "Indoor",
        context: { isIndoor: true, timeOfDay: 'night' },
        popularity: 90,
        tags: ['movies', 'comfort', 'relaxing', 'entertainment']
    },
    
    // Outdoor patterns
    {
        text: "sunny park picnic",
        category: "Outdoor",
        context: { isOutdoor: true, timeOfDay: 'afternoon', season: 'summer' },
        popularity: 92,
        tags: ['nature', 'food', 'family', 'relaxing']
    },
    {
        text: "hiking trail adventure",
        category: "Outdoor",
        context: { isOutdoor: true, timeOfDay: 'morning' },
        popularity: 85,
        tags: ['exercise', 'nature', 'challenging', 'scenic']
    },
    {
        text: "outdoor concert festival",
        category: "Outdoor",
        context: { isOutdoor: true, timeOfDay: 'evening', season: 'summer' },
        popularity: 89,
        tags: ['music', 'crowd', 'dancing', 'energetic']
    },
    {
        text: "beach sunset stroll",
        category: "Outdoor",
        context: { isOutdoor: true, timeOfDay: 'evening' },
        popularity: 91,
        tags: ['beach', 'romantic', 'peaceful', 'scenic']
    },
    
    // Hybrid patterns
    {
        text: "rooftop bar with city views",
        category: "Hybrid",
        context: { isHybrid: true, timeOfDay: 'evening' },
        popularity: 87,
        tags: ['drinks', 'views', 'social', 'upscale']
    },
    {
        text: "farmers market browsing",
        category: "Hybrid",
        context: { isHybrid: true, timeOfDay: 'morning' },
        popularity: 84,
        tags: ['food', 'local', 'community', 'fresh']
    },
    {
        text: "art gallery opening",
        category: "Hybrid",
        context: { isHybrid: true, timeOfDay: 'evening' },
        popularity: 79,
        tags: ['art', 'culture', 'social', 'sophisticated']
    },
    {
        text: "food truck festival",
        category: "Hybrid",
        context: { isHybrid: true, timeOfDay: 'afternoon' },
        popularity: 86,
        tags: ['food', 'variety', 'casual', 'social']
    }
];

/**
 * Props for AdvancedVibeInput
 */
interface AdvancedVibeInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
    onContextSuggestion?: (context: VibeContext) => void;
    placeholder?: string;
    disabled?: boolean;
    showVoiceInput?: boolean;
    showContextHints?: boolean;
    className?: string;
}

/**
 * Advanced vibe input component with auto-complete and voice input
 */
export const AdvancedVibeInput: React.FC<AdvancedVibeInputProps> = ({
    value,
    onChange,
    onSubmit,
    onContextSuggestion,
    placeholder = "Describe your ideal vibe...",
    disabled = false,
    showVoiceInput = true,
    showContextHints = true,
    className = ''
}) => {
    const { colors, shadows } = useThemeStyles();
    const [suggestions, setSuggestions] = useState<VibePattern[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [contextHint, setContextHint] = useState<string>('');
    
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const recognitionRef = useRef<any>(null);

    /**
     * Initialize voice recognition
     */
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setVoiceSupported(true);
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onChange(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [onChange]);

    /**
     * Generate suggestions based on input
     */
    useEffect(() => {
        if (!value.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const query = value.toLowerCase();
        const matchingSuggestions = POPULAR_VIBE_PATTERNS
            .filter(pattern => 
                pattern.text.toLowerCase().includes(query) ||
                pattern.tags.some(tag => tag.toLowerCase().includes(query))
            )
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 6);

        setSuggestions(matchingSuggestions);
        setShowSuggestions(matchingSuggestions.length > 0);
        setSelectedSuggestionIndex(-1);
    }, [value]);

    /**
     * Generate contextual hint
     */
    useEffect(() => {
        if (!value.trim()) {
            setContextHint('');
            return;
        }

        const query = value.toLowerCase();
        let hint = '';

        // Time-based hints
        const hour = new Date().getHours();
        if (hour < 12 && (query.includes('coffee') || query.includes('breakfast'))) {
            hint = '☀️ Perfect for a morning experience';
        } else if (hour >= 17 && (query.includes('dinner') || query.includes('bar'))) {
            hint = '🌆 Great evening choice';
        } else if (query.includes('outdoor') || query.includes('park') || query.includes('hike')) {
            hint = '🌳 Outdoor adventure detected';
        } else if (query.includes('cozy') || query.includes('indoor') || query.includes('book')) {
            hint = '🏠 Indoor comfort vibes';
        } else if (query.includes('music') || query.includes('concert')) {
            hint = '🎵 Musical experience ahead';
        } else if (query.includes('food') || query.includes('restaurant')) {
            hint = '🍽️ Culinary exploration';
        }

        setContextHint(hint);
    }, [value]);

    /**
     * Handle input change
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    /**
     * Handle key press
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                selectSuggestion(suggestions[selectedSuggestionIndex]);
            } else {
                onSubmit(value);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(-1);
        }
    };

    /**
     * Select a suggestion
     */
    const selectSuggestion = (pattern: VibePattern) => {
        onChange(pattern.text);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        
        // Suggest context to parent
        if (onContextSuggestion && pattern.context) {
            const vibeContext: VibeContext = {
                isIndoor: pattern.context.isIndoor || false,
                isOutdoor: pattern.context.isOutdoor || false,
                isHybrid: pattern.context.isHybrid || false,
                timeOfDay: pattern.context.timeOfDay,
                season: pattern.context.season,
                confidenceScore: 0.8
            };
            onContextSuggestion(vibeContext);
        }
    };

    /**
     * Start voice input
     */
    const startVoiceInput = () => {
        if (recognitionRef.current && !isListening) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    /**
     * Stop voice input
     */
    const stopVoiceInput = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    /**
     * Handle form submit
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(value);
    };

    return (
        <div className={`advanced-vibe-input relative ${className}`}>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    {/* Main Input */}
                    <div 
                        className="flex items-center rounded-xl border-2 transition-all duration-200 focus-within:shadow-lg"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: showSuggestions ? colors.primary : colors.border,
                            boxShadow: showSuggestions ? shadows.md : 'none'
                        }}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={value}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            onFocus={() => setShowSuggestions(suggestions.length > 0)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className="flex-1 px-6 py-4 bg-transparent border-none outline-none text-lg"
                            style={{ color: colors.text }}
                        />

                        {/* Voice Input Button */}
                        {showVoiceInput && voiceSupported && (
                            <button
                                type="button"
                                onClick={isListening ? stopVoiceInput : startVoiceInput}
                                disabled={disabled}
                                className={`mx-2 p-3 rounded-lg transition-all duration-200 ${
                                    isListening ? 'animate-pulse' : 'hover:scale-110'
                                }`}
                                style={{
                                    backgroundColor: isListening ? colors.error : `${colors.primary}20`,
                                    color: isListening ? colors.surface : colors.primary
                                }}
                            >
                                {isListening ? '🔴' : '🎤'}
                            </button>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={disabled || !value.trim()}
                            className="mx-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: colors.primary,
                                color: colors.surface
                            }}
                        >
                            ✨ Explore
                        </button>
                    </div>

                    {/* Context Hint */}
                    {showContextHints && contextHint && (
                        <div 
                            className="mt-2 px-4 py-2 rounded-lg text-sm"
                            style={{
                                backgroundColor: `${colors.accent}15`,
                                color: colors.accent
                            }}
                        >
                            {contextHint}
                        </div>
                    )}

                    {/* Auto-complete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div 
                            className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 max-h-80 overflow-y-auto"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                boxShadow: shadows.lg
                            }}
                        >
                            <div className="p-2">
                                <div className="text-xs font-medium mb-2 px-3" style={{ color: colors.textSecondary }}>
                                    Popular vibe patterns:
                                </div>
                                {suggestions.map((pattern, index) => (
                                    <div
                                        key={index}
                                        ref={el => suggestionRefs.current[index] = el}
                                        onClick={() => selectSuggestion(pattern)}
                                        className={`
                                            p-3 rounded-lg cursor-pointer transition-all duration-150
                                            ${selectedSuggestionIndex === index ? 'shadow-md' : 'hover:shadow-sm'}
                                        `}
                                        style={{
                                            backgroundColor: selectedSuggestionIndex === index 
                                                ? `${colors.primary}15` 
                                                : 'transparent',
                                            borderLeft: selectedSuggestionIndex === index 
                                                ? `3px solid ${colors.primary}` 
                                                : 'none'
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium mb-1" style={{ color: colors.text }}>
                                                    {pattern.text}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span 
                                                        className="text-xs px-2 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: `${colors.secondary}30`,
                                                            color: colors.text
                                                        }}
                                                    >
                                                        {pattern.category}
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        {pattern.tags.slice(0, 3).map((tag, tagIndex) => (
                                                            <span 
                                                                key={tagIndex}
                                                                className="text-xs"
                                                                style={{ color: colors.textSecondary }}
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs" style={{ color: colors.textSecondary }}>
                                                {pattern.popularity}% match
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {/* Voice Input Status */}
            {isListening && (
                <div 
                    className="mt-2 p-3 rounded-lg text-center"
                    style={{
                        backgroundColor: `${colors.error}15`,
                        border: `1px solid ${colors.error}30`
                    }}
                >
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium" style={{ color: colors.error }}>
                            Listening... Speak your vibe!
                        </span>
                    </div>
                </div>
            )}

            {/* Quick Templates */}
            <div className="mt-4">
                <div className="text-xs font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Quick templates:
                </div>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_VIBE_PATTERNS.slice(0, 4).map((pattern, index) => (
                        <button
                            key={index}
                            onClick={() => selectSuggestion(pattern)}
                            disabled={disabled}
                            className="px-3 py-1.5 text-xs rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            style={{
                                backgroundColor: `${colors.primary}15`,
                                color: colors.primary,
                                border: `1px solid ${colors.primary}30`
                            }}
                        >
                            {pattern.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}; 