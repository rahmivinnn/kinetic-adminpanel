
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  User, 
  Settings, 
  Bell, 
  FileText, 
  Monitor,
  Search,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  userRole: 'admin' | 'provider' | 'patient';
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  onSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userRole, 
  currentPage, 
  onPageChange, 
  isCollapsed, 
  onToggleCollapse,
  onLogout,
  onSettings
}) => {
  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: Activity },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'patients', label: 'Patients', icon: User },
      { id: 'providers', label: 'Providers', icon: User },
      { id: 'analytics', label: 'Analytics', icon: Monitor },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    provider: [
      { id: 'dashboard', label: 'Dashboard', icon: Activity },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'patients', label: 'My Patients', icon: User },
      { id: 'exercises', label: 'Exercises', icon: Activity },
      { id: 'ai-analysis', label: 'AI Analysis', icon: Monitor },
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    patient: [
      { id: 'dashboard', label: 'Dashboard', icon: Activity },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'exercises', label: 'My Exercises', icon: Activity },
      { id: 'progress', label: 'Progress', icon: Monitor },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  };

  const items = menuItems[userRole];

  const handleItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId); // Debug log
    
    // Prevent default behavior and ensure click is handled
    if (itemId === 'settings') {
      onSettings();
    } else {
      onPageChange(itemId);
    }
  };

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col",
        "sticky top-0 left-0 z-40"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="font-semibold text-gray-900">Kinetic AI</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-4 h-4 flex flex-col justify-center space-y-1">
              <div className="h-0.5 bg-gray-600 rounded"></div>
              <div className="h-0.5 bg-gray-600 rounded"></div>
              <div className="h-0.5 bg-gray-600 rounded"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleItemClick(item.id);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200",
                "group relative overflow-hidden cursor-pointer select-none",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
                isActive 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg" 
                  : "hover:bg-gray-50 text-gray-700 hover:shadow-sm"
              )}
              type="button"
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
              )} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <motion.button
          onClick={onLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
