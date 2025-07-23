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

  const getTotalDuration = () => {
    return dayPlan.reduce((total, slot) => total + (slot.duration || 90), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-neutral-200/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/plan" className="btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plan
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">Export Plan</h1>
                <p className="text-xs text-neutral-600">{currentCity.name}</p>
              </div>
            </div>
            <div className="w-16"></div> {/* Balance spacer */}
          </div>
        </div>
      </div>

      <div className="container-custom py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {/* Compact Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center">
              {/* Stats */}
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{scheduledItems.length}</div>
                <div className="text-xs text-neutral-600">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{Math.round(getTotalDuration() / 60)}h</div>
                <div className="text-xs text-neutral-600">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{new Set(selectedItems.map(item => item.category)).size}</div>
                <div className="text-xs text-neutral-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">AI</div>
                <div className="text-xs text-neutral-600">Optimized</div>
              </div>
              
              {/* Vibe */}
              <div className="text-center col-span-2 sm:col-span-1">
                <div className="text-sm font-medium text-neutral-800 truncate">"{vibeInput}"</div>
                <div className="text-xs text-neutral-600">Your Vibe</div>
              </div>
            </div>
          </motion.div>

          {/* Export Options - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6"
          >
            {/* Calendar Export */}
            <div className="card p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Calendar</h3>
                  <p className="text-xs text-neutral-600">Download .ics file</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download
              </button>
            </div>

            {/* Text Export */}
            <div className="card p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Text</h3>
                  <p className="text-xs text-neutral-600">Copy formatted text</p>
                </div>
              </div>
              <button
                onClick={handleCopyText}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Copy className="w-4 h-4 mr-2 inline" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Mobile Share */}
            <div className="card p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Share</h3>
                  <p className="text-xs text-neutral-600">Native mobile share</p>
                </div>
              </div>
              <button
                onClick={handleMobileShare}
                disabled={!navigator.share}
                className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4 mr-2 inline" />
                {navigator.share ? 'Share' : 'Not Available'}
              </button>
            </div>
          </motion.div>

          {/* Compact Plan Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 mb-6"
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Plan Preview</h2>

            <div className="space-y-3">
              {scheduledItems.map((slot, index) => (
                <div
                  key={slot.id}
                  className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-xl"
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary-600" />
                    </div>
                    <p className="text-xs font-medium text-neutral-600 mt-1">{slot.time}</p>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-neutral-900 text-sm truncate">
                        {slot.item?.name}
                      </h3>
                      {slot.item?.rating && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-neutral-600">{slot.item.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-neutral-500 mt-1">
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

          {/* Compact Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-gradient-to-r from-primary-50 via-primary-100/50 to-primary-50 border-primary-200"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-primary-900">Share Your Experience</h3>
              </div>
              
              <p className="text-sm text-primary-700 mb-4 max-w-2xl mx-auto">
                After your amazing day in {currentCity.name}, we'd love to hear how your VibeTrail experience went!
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <a
                  href={`mailto:feedback@vibetrail.com?subject=My ${currentCity.name} Experience&body=${encodeURIComponent(generateShareableText())}`}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Feedback
                </a>
                <a
                  href="https://qloo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-primary-600 py-2 px-4 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  About Qloo
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-primary-200">
                <p className="text-xs text-primary-600">
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