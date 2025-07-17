import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TasteItem, CityData, TimeSlot } from '../types';
import { cities } from '../data/mockData';

interface AppContextType {
  currentCity: CityData;
  setCurrentCity: (city: CityData) => void;
  selectedItems: TasteItem[];
  setSelectedItems: (items: TasteItem[]) => void;
  vibeInput: string;
  setVibeInput: (vibe: string) => void;
  dayPlan: TimeSlot[];
  setDayPlan: (plan: TimeSlot[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  profileType: 'single' | 'couple' | 'family';
  setProfileType: (type: 'single' | 'couple' | 'family') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<CityData>(cities[0]); // Default to LA
  const [selectedItems, setSelectedItems] = useState<TasteItem[]>([]);
  const [vibeInput, setVibeInput] = useState<string>('');
  const [dayPlan, setDayPlan] = useState<TimeSlot[]>([
    { id: 'morning', name: 'Morning', time: '9:00 AM' },
    { id: 'lunch', name: 'Lunch', time: '12:00 PM' },
    { id: 'afternoon', name: 'Afternoon', time: '2:00 PM' },
    { id: 'dinner', name: 'Dinner', time: '6:00 PM' },
    { id: 'evening', name: 'Evening', time: '8:00 PM' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileType, setProfileType] = useState<'single' | 'couple' | 'family'>('single');

  return (
    <AppContext.Provider value={{
      currentCity,
      setCurrentCity,
      selectedItems,
      setSelectedItems,
      vibeInput,
      setVibeInput,
      dayPlan,
      setDayPlan,
      isLoading,
      setIsLoading,
      profileType,
      setProfileType
    }}>
      {children}
    </AppContext.Provider>
  );
};