import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Download, Calendar, Clock, MapPin } from 'lucide-react';
import { downloadCalendar } from '../utils/export';

const Export: React.FC = () => {
  const { dayPlan, currentCity, vibeInput } = useApp();
  const scheduledItems = dayPlan.filter(slot => slot.item);

  const handleDownload = () => {
    downloadCalendar(dayPlan, currentCity.name);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Your Day Plan</h1>
        <p className="text-gray-600">
          Your personalized {currentCity.name} itinerary based on "{vibeInput}" is ready to download
        </p>
      </div>

      {/* Plan Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Plan Preview</h2>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download size={16} />
            <span>Download Calendar</span>
          </button>
        </div>

        <div className="space-y-4">
          {scheduledItems.map(slot => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-l-4 border-purple-500 pl-4 py-3"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock size={14} />
                    <span>{slot.time}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{slot.item?.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <MapPin size={14} />
                    <span>{slot.item?.location}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{slot.item?.description}</p>
                  <p className="text-sm text-purple-700 italic mt-2">"{slot.explanation}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar size={20} className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Calendar Export</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Download as .ics file compatible with Google Calendar, Apple Calendar, Outlook, and more.
            </p>
            <button
              onClick={handleDownload}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Download .ics File
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Download size={20} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Text Export</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Simple text format for easy sharing via email or messaging.
            </p>
            <button
              disabled
              className="w-full bg-gray-200 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Sharing Info */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">Share Your Experience</h2>
        <p className="text-purple-700 mb-4">
          After your day out, we'd love to hear how your TasteTrails experience went! 
          This helps us improve our cross-domain recommendations powered by Qloo Taste AI.
        </p>
        <div className="text-sm text-purple-600">
          <p>✨ Powered by Qloo's cultural intelligence</p>
          <p>🤖 Enhanced with AI scheduling and explanations</p>
          <p>🔒 Privacy-first - no personal data stored</p>
        </div>
      </div>
    </div>
  );
};

export default Export;