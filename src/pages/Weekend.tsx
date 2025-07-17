import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { weekendEvents } from '../data/mockData';
import { Calendar, Users, User, Heart, Clock, MapPin } from 'lucide-react';

const Weekend: React.FC = () => {
  const { currentCity, profileType, setProfileType } = useApp();
  const events = weekendEvents[currentCity.code] || [];

  const profileIcons = {
    single: User,
    couple: Heart,
    family: Users
  };

  const ProfileButton: React.FC<{ type: 'single' | 'couple' | 'family' }> = ({ type }) => {
    const Icon = profileIcons[type];
    return (
      <button
        onClick={() => setProfileType(type)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          profileType === type 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <Icon size={16} />
        <span className="capitalize">{type}</span>
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekend Planning</h1>
        <p className="text-gray-600">
          Extended TasteTrails planning for multi-day experiences in {currentCity.name}
        </p>
      </div>

      {/* Profile Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Profile</h2>
        <div className="flex space-x-3">
          <ProfileButton type="single" />
          <ProfileButton type="couple" />
          <ProfileButton type="family" />
        </div>
      </div>

      {/* Weekend Events */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar size={20} className="text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">This Weekend's Events</h2>
        </div>

        <div className="space-y-6">
          {events.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs capitalize">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Paired Recommendation */}
                {event.pairedRecommendation && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900 mb-2">Perfect Pairing</h4>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={event.pairedRecommendation.image} 
                        alt={event.pairedRecommendation.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{event.pairedRecommendation.name}</h5>
                        <p className="text-sm text-gray-600">{event.pairedRecommendation.location}</p>
                        <p className="text-sm text-purple-700 italic mt-1">
                          "{event.pairedRecommendation.whyItFits}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">Coming Soon</h2>
        <ul className="text-purple-700 space-y-1">
          <li>• Multi-day itinerary planning</li>
          <li>• Real-time event integration</li>
          <li>• Group coordination features</li>
          <li>• Booking integration with venues</li>
          <li>• Weather-based recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default Weekend;