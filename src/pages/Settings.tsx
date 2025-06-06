import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Key,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  FileText,
  Zap,
  Wifi,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  location: string;
  bio: string;
  avatar: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginNotifications: boolean;
  deviceTracking: boolean;
  ipWhitelist: string[];
  lastPasswordChange: string;
  activeSessions: number;
}

interface SystemSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  autoSave: boolean;
  autoBackup: boolean;
  dataRetention: number;
  performanceMode: boolean;
  debugMode: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    appointments: boolean;
    reminders: boolean;
    systemUpdates: boolean;
    securityAlerts: boolean;
    reports: boolean;
  };
}

const mockProfile: UserProfile = {
  firstName: 'Dr. Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@kineticai.com',
  phone: '+1 (555) 123-4567',
  title: 'Senior Physical Therapist',
  department: 'Rehabilitation Services',
  location: 'New York, NY',
  bio: 'Experienced physical therapist specializing in sports rehabilitation and movement analysis.',
  avatar: '/avatars/dr-johnson.jpg',
  timezone: 'America/New_York',
  language: 'en-US',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h'
};

const mockSecurity: SecuritySettings = {
  twoFactorEnabled: true,
  sessionTimeout: 30,
  passwordExpiry: 90,
  loginNotifications: true,
  deviceTracking: true,
  ipWhitelist: ['192.168.1.100', '10.0.0.50'],
  lastPasswordChange: '2024-01-01',
  activeSessions: 2
};

const mockSystem: SystemSettings = {
  theme: 'light',
  language: 'en-US',
  timezone: 'America/New_York',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD',
  autoSave: true,
  autoBackup: true,
  dataRetention: 365,
  performanceMode: false,
  debugMode: false
};

const mockNotifications: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  soundEnabled: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00'
  },
  categories: {
    appointments: true,
    reminders: true,
    systemUpdates: true,
    securityAlerts: true,
    reports: false
  }
};

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [security, setSecurity] = useState<SecuritySettings>(mockSecurity);
  const [system, setSystem] = useState<SystemSettings>(mockSystem);
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotifications);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setProfile(mockProfile);
    setSecurity(mockSecurity);
    setSystem(mockSystem);
    setNotifications(mockNotifications);
    setHasChanges(false);
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateSecurity = (field: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateSystem = (field: keyof SystemSettings, value: any) => {
    setSystem(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateNotifications = (field: keyof NotificationSettings, value: any) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleUpdatePassword = () => {
    alert('🔐 Password Update\nOpening password update form...');
  };

  const handleExportData = () => {
    alert('📤 Export Data\nPreparing data export...');
  };

  const handleImportData = () => {
    alert('📥 Import Data\nOpening file selection dialog...');
  };

  const handleClearData = () => {
    alert('🗑️ Clear Data\nThis action will permanently delete all data!');
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account, security, and system preferences</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="bg-white/70 backdrop-blur-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Reset Changes
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>

      {/* Change Indicator */}
      {hasChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-100 border border-blue-200 rounded-lg p-3 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 text-sm">You have unsaved changes</span>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                    </div>
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-gray-600">{profile.title}</p>
                    <p className="text-sm text-gray-500">{profile.department}</p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateProfile('firstName', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateProfile('lastName', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => updateProfile('title', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => updateProfile('department', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                </div>

                {/* Location and Bio */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => updateProfile('location', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => updateProfile('bio', e.target.value)}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={profile.timezone} onValueChange={(value) => updateProfile('timezone', value)}>
                      <SelectTrigger className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={profile.language} onValueChange={(value) => updateProfile('language', value)}>
                      <SelectTrigger className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={profile.dateFormat} onValueChange={(value) => updateProfile('dateFormat', value)}>
                      <SelectTrigger className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select value={profile.timeFormat} onValueChange={(value) => updateProfile('timeFormat', value)}>
                      <SelectTrigger className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Security Score</p>
                      <p className="text-2xl font-bold text-green-600">85%</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <Progress value={85} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Sessions</p>
                      <p className="text-2xl font-bold text-blue-600">{security.activeSessions}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Monitor className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Last Password Change</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(security.lastPasswordChange).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Password & Authentication */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Password & Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSecurity('twoFactorEnabled', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Current password"
                        className="bg-white/70 backdrop-blur-sm border-0 shadow-lg pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <Button variant="outline" className="bg-white/70 backdrop-blur-sm" onClick={handleUpdatePassword}>
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Session Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Input
                      type="number"
                      value={security.passwordExpiry}
                      onChange={(e) => updateSecurity('passwordExpiry', parseInt(e.target.value))}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Login Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) => updateSecurity('loginNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Device Tracking</h4>
                      <p className="text-sm text-gray-600">Track and manage logged-in devices</p>
                    </div>
                    <Switch
                      checked={security.deviceTracking}
                      onCheckedChange={(checked) => updateSecurity('deviceTracking', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {/* Appearance */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={system.theme === 'light' ? 'default' : 'outline'}
                      onClick={() => updateSystem('theme', 'light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </Button>
                    <Button
                      variant={system.theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => updateSystem('theme', 'dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </Button>
                    <Button
                      variant={system.theme === 'auto' ? 'default' : 'outline'}
                      onClick={() => updateSystem('theme', 'auto')}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="w-4 h-4" />
                      Auto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Preferences */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={system.currency} onValueChange={(value) => updateSystem('currency', value)}>
                      <SelectTrigger className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Retention (days)</Label>
                    <Input
                      type="number"
                      value={system.dataRetention}
                      onChange={(e) => updateSystem('dataRetention', parseInt(e.target.value))}
                      className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto Save</h4>
                      <p className="text-sm text-gray-600">Automatically save changes</p>
                    </div>
                    <Switch
                      checked={system.autoSave}
                      onCheckedChange={(checked) => updateSystem('autoSave', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto Backup</h4>
                      <p className="text-sm text-gray-600">Automatically backup data</p>
                    </div>
                    <Switch
                      checked={system.autoBackup}
                      onCheckedChange={(checked) => updateSystem('autoBackup', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Performance Mode</h4>
                      <p className="text-sm text-gray-600">Optimize for better performance</p>
                    </div>
                    <Switch
                      checked={system.performanceMode}
                      onCheckedChange={(checked) => updateSystem('performanceMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Debug Mode</h4>
                      <p className="text-sm text-gray-600">Enable debugging features</p>
                    </div>
                    <Switch
                      checked={system.debugMode}
                      onCheckedChange={(checked) => updateSystem('debugMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="bg-white/70 backdrop-blur-sm" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="bg-white/70 backdrop-blur-sm" onClick={handleImportData}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleClearData}>
                          Delete All Data
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notification Channels */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => updateNotifications('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => updateNotifications('pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => updateNotifications('smsNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {notifications.soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-gray-600" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-600" />
                      )}
                      <div>
                        <h4 className="font-medium">Sound Notifications</h4>
                        <p className="text-sm text-gray-600">Play sound for notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.soundEnabled}
                      onCheckedChange={(checked) => updateNotifications('soundEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Categories */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Notification Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span>Appointments</span>
                    </div>
                    <Switch
                      checked={notifications.categories.appointments}
                      onCheckedChange={(checked) => 
                        updateNotifications('categories', { ...notifications.categories, appointments: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>Reminders</span>
                    </div>
                    <Switch
                      checked={notifications.categories.reminders}
                      onCheckedChange={(checked) => 
                        updateNotifications('categories', { ...notifications.categories, reminders: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SettingsIcon className="w-4 h-4 text-gray-600" />
                      <span>System Updates</span>
                    </div>
                    <Switch
                      checked={notifications.categories.systemUpdates}
                      onCheckedChange={(checked) => 
                        updateNotifications('categories', { ...notifications.categories, systemUpdates: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-gray-600" />
                      <span>Security Alerts</span>
                    </div>
                    <Switch
                      checked={notifications.categories.securityAlerts}
                      onCheckedChange={(checked) => 
                        updateNotifications('categories', { ...notifications.categories, securityAlerts: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>Reports</span>
                    </div>
                    <Switch
                      checked={notifications.categories.reports}
                      onCheckedChange={(checked) => 
                        updateNotifications('categories', { ...notifications.categories, reports: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Quiet Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Quiet Hours</h4>
                    <p className="text-sm text-gray-600">Disable notifications during specified hours</p>
                  </div>
                  <Switch
                    checked={notifications.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      updateNotifications('quietHours', { ...notifications.quietHours, enabled: checked })
                    }
                  />
                </div>
                
                {notifications.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={notifications.quietHours.start}
                        onChange={(e) => 
                          updateNotifications('quietHours', { ...notifications.quietHours, start: e.target.value })
                        }
                        className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={notifications.quietHours.end}
                        onChange={(e) => 
                          updateNotifications('quietHours', { ...notifications.quietHours, end: e.target.value })
                        }
                        className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;