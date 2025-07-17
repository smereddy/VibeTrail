import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TimeSlot, TasteItem } from '../types';
import { Clock, Wand2, Download, CircleDot as DragHandleDots2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadCalendar } from '../utils/export';

const Plan: React.FC = () => {
  const { selectedItems, dayPlan, setDayPlan, currentCity } = useApp();
  const [draggedItem, setDraggedItem] = useState<TasteItem | null>(null);
  const [draggedSlot, setDraggedSlot] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, item: TasteItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (draggedItem) {
      const newPlan = dayPlan.map(slot => {
        if (slot.id === slotId) {
          return {
            ...slot,
            item: draggedItem,
            explanation: `${draggedItem.whyItFits} Perfect timing for ${slot.name.toLowerCase()}.`
          };
        }
        return slot;
      });
      setDayPlan(newPlan);
      setDraggedItem(null);
    }
  };

  const removeFromSlot = (slotId: string) => {
    const newPlan = dayPlan.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          item: undefined,
          explanation: undefined
        };
      }
      return slot;
    });
    setDayPlan(newPlan);
  };

  const autoArrange = () => {
    const foodItems = selectedItems.filter(item => item.category === 'food');
    const activityItems = selectedItems.filter(item => item.category === 'activity');
    const mediaItems = selectedItems.filter(item => item.category === 'media');

    const newPlan = [...dayPlan];
    
    // Sort by taste strength
    const sortedItems = [...selectedItems].sort((a, b) => b.tasteStrength - a.tasteStrength);
    
    // Smart assignment based on time and category
    const assignments = [
      { slotId: 'morning', preferredCategory: 'activity', item: activityItems[0] },
      { slotId: 'lunch', preferredCategory: 'food', item: foodItems[0] },
      { slotId: 'afternoon', preferredCategory: 'activity', item: activityItems[1] || sortedItems[0] },
      { slotId: 'dinner', preferredCategory: 'food', item: foodItems[1] || foodItems[0] },
      { slotId: 'evening', preferredCategory: 'media', item: mediaItems[0] || activityItems[0] }
    ];

    assignments.forEach(({ slotId, item }) => {
      const slotIndex = newPlan.findIndex(slot => slot.id === slotId);
      if (slotIndex !== -1 && item) {
        newPlan[slotIndex] = {
          ...newPlan[slotIndex],
          item,
          explanation: `${item.whyItFits} Perfect timing for ${newPlan[slotIndex].name.toLowerCase()}.`
        };
      }
    });

    setDayPlan(newPlan);
  };

  const hasScheduledItems = dayPlan.some(slot => slot.item);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Day Plan</h1>
        <p className="text-gray-600">
          Drag items to time slots or use AI to auto-arrange your perfect day in {currentCity.name}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={autoArrange}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Wand2 size={16} />
          <span>Auto Arrange (AI)</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {selectedItems.length} selected items
          </span>
          <Link
            to="/export"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              hasScheduledItems 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={hasScheduledItems ? undefined : (e) => e.preventDefault()}
          >
            <Download size={16} />
            <span>Export Plan</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Items */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Selected Items</h2>
          <div className="space-y-3">
            {selectedItems.map(item => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="bg-white rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-shadow border-l-4 border-purple-500"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                  </div>
                  <DragHandleDots2 size={16} className="text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Day Schedule */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Day Schedule</h2>
          <div className="space-y-4">
            {dayPlan.map(slot => (
              <div
                key={slot.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot.id)}
                className={`bg-white rounded-lg shadow-sm p-6 min-h-[120px] border-2 border-dashed transition-colors ${
                  slot.item ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{slot.name}</h3>
                    <span className="text-sm text-gray-600">{slot.time}</span>
                  </div>
                  {slot.item && (
                    <button
                      onClick={() => removeFromSlot(slot.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {slot.item ? (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={slot.item.image} 
                      alt={slot.item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{slot.item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{slot.item.location}</p>
                      <p className="text-sm text-purple-700 italic">"{slot.explanation}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Drop an item here or use Auto Arrange</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;