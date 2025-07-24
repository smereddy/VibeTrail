import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Share2,
  FileText,
  Smartphone,
  Mail,
  Copy,
  CheckCircle,
  Star,
  Sparkles,
  Users,
  Heart,
  ExternalLink
} from 'lucide-react';
import { downloadCalendar } from '../utils/export';

const Export: React.FC = () => {
  const { dayPlan, currentCity, vibeInput, selectedItems } = useApp();
  const [copied, setCopied] = useState(false);
  
  const scheduledItems = dayPlan.filter(slot => slot.item);
  
  // Calculate accurate stats based on selected items and AI-generated schedule
  const getStats = () => {
    const activities = selectedItems.length;
    const categories = new Set(selectedItems.map(item => item.category)).size;
    const duration = selectedItems.reduce((total, item) => total + (item.estimatedDuration || 90), 0);
    const hasAISchedule = scheduledItems.length > 0;
    
    return { activities, categories, duration, hasAISchedule };
  };
  
  const stats = getStats();

  const handleDownload = async () => {
    try {
      await downloadCalendar(dayPlan, currentCity.name);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const generateShareableText = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
    
    let text = `🌟 My Perfect Day in ${currentCity.name}\n`;
    text += `📅 ${dateStr}\n`;
    text += `✨ Vibe: "${vibeInput}"\n\n`;
    
    scheduledItems.forEach((slot, index) => {
      text += `${index + 1}. ${slot.time} - ${slot.item?.name}\n`;
      text += `   📍 ${slot.item?.location}\n`;
      if (slot.item?.rating) {
        text += `   ⭐ ${slot.item.rating}/5\n`;
      }
      text += `\n`;
    });
    
    text += `\n🤖 Created with VibeTrail AI - Powered by Qloo Taste Intelligence`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareableText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleMobileShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Perfect Day in ${currentCity.name}`,
          text: generateShareableText(),
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/plan"
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plan
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Export Plan</h1>
                <p className="text-sm text-gray-500">{currentCity.name}</p>
              </div>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center">
              {/* Stats */}
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{stats.activities}</div>
                <div className="text-xs text-gray-600">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{Math.round(stats.duration / 60)}h</div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{stats.categories}</div>
                <div className="text-xs text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{stats.hasAISchedule ? 'AI' : 'Manual'}</div>
                <div className="text-xs text-gray-600">Optimized</div>
              </div>
              
              {/* Vibe */}
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-sm font-medium text-gray-800 truncate">"{vibeInput}"</div>
                <div className="text-xs text-gray-600">Your Vibe</div>
              </div>
            </div>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Calendar Export */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Calendar</h3>
                  <p className="text-sm text-gray-600">Download .ics file</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download
              </button>
            </div>

            {/* Text Export */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Text</h3>
                  <p className="text-sm text-gray-600">Copy formatted text</p>
                </div>
              </div>
              <button
                onClick={handleCopyText}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Copy className="w-4 h-4 mr-2 inline" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Mobile Share */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Share</h3>
                  <p className="text-sm text-gray-600">Native mobile share</p>
                </div>
              </div>
              <button
                onClick={handleMobileShare}
                disabled={!navigator.share}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4 mr-2 inline" />
                {navigator.share ? 'Share' : 'Not Available'}
              </button>
            </div>
          </motion.div>

          {/* Plan Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Plan Preview</h2>

            <div className="space-y-4">
              {scheduledItems.map((slot, index) => (
                <div
                  key={slot.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-600 mt-1">{slot.time}</p>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {slot.item?.name}
                      </h3>
                      {slot.item?.rating && (
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-600">{slot.item.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{slot.item?.location}</span>
                      <span>•</span>
                      <span>{slot.duration || 90}min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Share Your Experience</h3>
              </div>
              
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                After your amazing day in {currentCity.name}, we'd love to hear how your VibeTrail experience went!
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <a
                  href={`mailto:feedback@vibetrail.com?subject=My ${currentCity.name} Experience&body=${encodeURIComponent(generateShareableText())}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Feedback
                </a>
                <a
                  href="https://qloo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  About Qloo
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  🤖 AI-Powered • ✨ Qloo Taste Intelligence • 🔒 Privacy-First
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Export;