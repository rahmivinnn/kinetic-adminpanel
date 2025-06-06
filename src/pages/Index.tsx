
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import Topbar from '@/components/Layout/Topbar';
import ProviderDashboard from '@/components/Dashboard/ProviderDashboard';
import PatientDashboard from '@/components/Dashboard/PatientDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Activity, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import actual page components
import AdminPanel from './AdminPanel';
import Appointments from './Appointments';
import MyPatients from './MyPatients';
import Exercises from './Exercises';
import AIAnalysis from './AIAnalysis';
import Reports from './Reports';
import Notifications from './Notifications';
import Settings from './Settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'provider' | 'patient'>('provider');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock user data with realistic notifications
  const userData = {
    admin: {
      name: 'Admin User',
      notificationCount: 8,
      notifications: [
        { id: 1, title: 'System Update', message: 'New features available', type: 'system' },
        { id: 2, title: 'User Registration', message: '5 new users registered today', type: 'info' }
      ]
    },
    provider: {
      name: 'Dr. Sarah Johnson',
      notificationCount: 5,
      notifications: [
        { id: 1, title: 'Appointment Reminder', message: 'Patient John Smith - 2:00 PM', type: 'appointment' },
        { id: 2, title: 'Exercise Update', message: 'New exercise plan approved', type: 'exercise' }
      ]
    },
    patient: {
      name: 'John Smith',
      notificationCount: 3,
      notifications: [
        { id: 1, title: 'Exercise Reminder', message: 'Time for your daily exercises', type: 'exercise' },
        { id: 2, title: 'Appointment Confirmed', message: 'Tomorrow at 2:00 PM with Dr. Johnson', type: 'appointment' }
      ]
    }
  };

  const handlePageChange = (page: string) => {
    console.log('Navigating to:', page); // Debug log
    setCurrentPage(page);
    
    // Get page display name
    const pageNames: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'appointments': 'Appointments',
      'patients': userRole === 'provider' ? 'My Patients' : 'Patients',
      'providers': 'Providers',
      'exercises': userRole === 'patient' ? 'My Exercises' : 'Exercises',
      'ai-analysis': 'AI Analysis',
      'progress': 'Progress',
      'analytics': 'Analytics',
      'reports': 'Reports',
      'notifications': 'Notifications',
      'settings': 'Settings'
    };
    
    const displayName = pageNames[page] || page.charAt(0).toUpperCase() + page.slice(1);
    
    toast({
      title: "✅ Navigation",
      description: `Switched to ${displayName}`,
      duration: 2000,
    });
  };

  const handleRoleSwitch = (role: 'admin' | 'provider' | 'patient') => {
    setUserRole(role);
    setCurrentPage('dashboard');
    toast({
      title: "Role switched",
      description: `Switched to ${role} view`,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    // In a real app, this would redirect to login page
    console.log("Logout functionality triggered");
  };

  const handleSettings = () => {
    navigate('/settings');
    toast({
      title: "Settings",
      description: "Opening settings page",
    });
  };

  const handleProfileClick = () => {
    navigate('/settings');
    toast({
      title: "Profile",
      description: "Opening profile settings",
    });
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
    toast({
      title: "Notifications",
      description: "Opening notifications",
    });
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        if (userRole === 'admin') {
          return <AdminPanel />;
        } else if (userRole === 'provider') {
          return <ProviderDashboard />;
        } else {
          return <PatientDashboard />;
        }
      case 'appointments':
        return <Appointments />;
      case 'patients':
        return <MyPatients />;
      case 'providers':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Providers Management</h1>
            <p className="text-gray-600">Manage healthcare providers and their profiles.</p>
          </div>
        );
      case 'exercises':
        return <Exercises />;
      case 'ai-analysis':
        return <AIAnalysis />;
      case 'progress':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Progress Tracking</h1>
            <p className="text-gray-600">Track your rehabilitation progress and milestones.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            <p className="text-gray-600">View detailed analytics and performance metrics.</p>
          </div>
        );
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        if (userRole === 'admin') {
          return <AdminPanel />;
        } else if (userRole === 'provider') {
          return <ProviderDashboard />;
        } else {
          return <PatientDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed Position */}
      <div className="flex-shrink-0">
        <Sidebar
          userRole={userRole}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onLogout={handleLogout}
          onSettings={handleSettings}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar
          userRole={userRole}
          userName={userData[userRole].name}
          notificationCount={userData[userRole].notificationCount}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettings}
          onNotificationClick={handleNotificationClick}
          onLogout={handleLogout}
        />

        {/* Demo Role Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-slate-700">Demo Mode:</span>
              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)} View
              </Badge>
              {userRole === 'admin' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.open('/admin', '_blank')}
                  className="text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600"
                >
                  Open Admin Panel
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={userRole === 'admin' ? 'default' : 'outline'}
                onClick={() => handleRoleSwitch('admin')}
                className={`text-xs transition-all duration-200 hover:scale-105 ${
                  userRole === 'admin' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' 
                    : 'hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                Admin
              </Button>
              <Button
                size="sm"
                variant={userRole === 'provider' ? 'default' : 'outline'}
                onClick={() => handleRoleSwitch('provider')}
                className={`text-xs transition-all duration-200 hover:scale-105 ${
                  userRole === 'provider' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                Provider
              </Button>
              <Button
                size="sm"
                variant={userRole === 'patient' ? 'default' : 'outline'}
                onClick={() => handleRoleSwitch('patient')}
                className={`text-xs transition-all duration-200 hover:scale-105 ${
                  userRole === 'patient' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600' 
                    : 'hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                Patient
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full min-h-screen"
            >
              {renderPageContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Admin Dashboard component
const AdminDashboard = () => (
  <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
        Admin Dashboard
      </h1>
      <p className="text-slate-600">Comprehensive system overview and management</p>
      <div className="mt-4">
        <Button 
          onClick={() => window.open('/admin', '_blank')}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0"
        >
          Open Full Admin Panel
        </Button>
      </div>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <User className="w-5 h-5 text-white" />
              </div>
              <span>Total Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">1,247</div>
            <p className="text-sm text-emerald-600 mt-1 flex items-center">
              <span className="text-emerald-600">↗</span> +12% from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span>Active Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">342</div>
            <p className="text-sm text-emerald-600 mt-1 flex items-center">
              <span className="text-emerald-600">↗</span> Current active users
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span>Appointments Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">89</div>
            <p className="text-sm text-slate-600 mt-1">Across all providers</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used admin functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-all">
              <User className="w-6 h-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all">
              <Activity className="w-6 h-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-violet-50 hover:border-violet-300 transition-all">
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 transition-all">
              <span className="text-2xl">⚙️</span>
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

// Use actual components instead of placeholders
const AppointmentsPage = () => <Appointments />;
const PatientsPage = () => <MyPatients />;
const ProvidersPage = () => <MyPatients />;
const ExercisesPage = () => <Exercises />;
const AIAnalysisPage = () => <AIAnalysis />;
const ProgressPage = () => <MyPatients />;
const AnalyticsPage = () => <Reports />;
const ReportsPage = () => <Reports />;
const NotificationsPage = () => <Notifications />;
const SettingsPage = () => <Settings />;

export default Index;
