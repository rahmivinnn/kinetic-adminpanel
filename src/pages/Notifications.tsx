import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BellRing,
  Check,
  X,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  MoreVertical,
  Star,
  StarOff,
  ChevronDown,
  Download,
  Share,
  Plus,
  Zap,
  Heart,
  Activity,
  TrendingUp,
  Shield,
  Users,
  FileText,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'exercise' | 'medication' | 'system' | 'progress' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  actionRequired: boolean;
  sender?: string;
  channels: string[];
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

interface NotificationSettings {
  soundEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories: {
    appointments: boolean;
    exercises: boolean;
    medications: boolean;
    system: boolean;
    progress: boolean;
    reminders: boolean;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Upcoming Appointment',
    message: 'You have a physical therapy session with Dr. Smith tomorrow at 2:00 PM.',
    type: 'appointment',
    priority: 'high',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    actionRequired: true,
    sender: 'Dr. Smith',
    channels: ['push', 'email'],
    relatedEntity: {
      type: 'appointment',
      id: 'apt_001',
      name: 'Physical Therapy Session'
    }
  },
  {
    id: '2',
    title: 'Exercise Reminder',
    message: 'Time for your daily shoulder exercises. Complete 3 sets of 10 repetitions.',
    type: 'exercise',
    priority: 'medium',
    timestamp: '2024-01-15T08:00:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    actionRequired: true,
    channels: ['push'],
    relatedEntity: {
      type: 'exercise',
      id: 'ex_001',
      name: 'Shoulder Mobility Exercises'
    }
  },
  {
    id: '3',
    title: 'Progress Update',
    message: 'Great job! You\'ve completed 85% of your weekly exercise goals.',
    type: 'progress',
    priority: 'low',
    timestamp: '2024-01-14T18:45:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    actionRequired: false,
    channels: ['push', 'email'],
    relatedEntity: {
      type: 'progress',
      id: 'prog_001',
      name: 'Weekly Exercise Goals'
    }
  },
  {
    id: '4',
    title: 'Medication Reminder',
    message: 'Don\'t forget to take your prescribed anti-inflammatory medication.',
    type: 'medication',
    priority: 'urgent',
    timestamp: '2024-01-15T12:00:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    actionRequired: true,
    channels: ['push', 'sms'],
    relatedEntity: {
      type: 'medication',
      id: 'med_001',
      name: 'Anti-inflammatory'
    }
  },
  {
    id: '5',
    title: 'System Update',
    message: 'New features have been added to your rehabilitation dashboard.',
    type: 'system',
    priority: 'low',
    timestamp: '2024-01-13T09:15:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    actionRequired: false,
    channels: ['push', 'email']
  }
];

const mockSettings: NotificationSettings = {
  soundEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00'
  },
  categories: {
    appointments: true,
    exercises: true,
    medications: true,
    system: false,
    progress: true,
    reminders: true
  }
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exercise': return 'bg-green-100 text-green-800 border-green-200';
      case 'medication': return 'bg-red-100 text-red-800 border-red-200';
      case 'system': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'exercise': return <Activity className="w-4 h-4" />;
      case 'medication': return <Heart className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'progress': return <TrendingUp className="w-4 h-4" />;
      case 'reminder': return <Bell className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />;
      case 'sms': return <MessageSquare className="w-3 h-3" />;
      case 'push': return <Smartphone className="w-3 h-3" />;
      case 'phone': return <Phone className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    const notArchived = !notification.isArchived;
    
    return matchesSearch && matchesType && matchesPriority && matchesReadStatus && notArchived;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: false } : notif
    ));
  };

  const toggleStar = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isStarred: !notif.isStarred } : notif
    ));
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isArchived: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const stats = {
    total: notifications.filter(n => !n.isArchived).length,
    unread: notifications.filter(n => !n.isRead && !n.isArchived).length,
    starred: notifications.filter(n => n.isStarred && !n.isArchived).length,
    urgent: notifications.filter(n => n.priority === 'urgent' && !n.isArchived).length
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
            Notifications
          </h1>
          <p className="text-gray-600 mt-1">Stay updated with your rehabilitation progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="bg-white/70 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/70 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total', value: stats.total, icon: Bell, color: 'blue' },
          { label: 'Unread', value: stats.unread, icon: BellRing, color: 'orange' },
          { label: 'Starred', value: stats.starred, icon: Star, color: 'yellow' },
          { label: 'Urgent', value: stats.urgent, icon: AlertTriangle, color: 'red' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border-0"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100/50">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="p-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40 bg-white/50">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="appointment">Appointments</SelectItem>
                    <SelectItem value="exercise">Exercises</SelectItem>
                    <SelectItem value="medication">Medications</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                    <SelectItem value="reminder">Reminders</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40 bg-white/50">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unread-only"
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <label htmlFor="unread-only" className="text-sm font-medium">
                    Unread only
                  </label>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    !notification.isRead ? 'ring-2 ring-blue-200' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          getTypeColor(notification.type)
                        } flex-shrink-0`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full mb-2"></div>
                              )}
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  getPriorityColor(notification.priority)
                                }`}></div>
                                <h3 className={`font-semibold ${
                                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h3>
                                <Badge variant="outline" className={getTypeColor(notification.type)}>
                                  {notification.type}
                                </Badge>
                              </div>
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="mb-2">
                                  Action Required
                                </Badge>
                              )}
                              <p className={`text-sm mb-2 ${
                                !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                {notification.sender && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {notification.sender}
                                  </span>
                                )}
                                <div className="flex items-center gap-1">
                                  {notification.channels.map((channel, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      {getChannelIcon(channel)}
                                    </div>
                                  ))}
                                </div>
                                {notification.relatedEntity && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {notification.relatedEntity.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStar(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                {notification.isStarred ? (
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                ) : (
                                  <StarOff className="w-4 h-4 text-gray-400" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                {notification.isRead ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-blue-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => archiveNotification(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Archive className="w-4 h-4 text-gray-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-6 space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Sound Notifications</label>
                      <p className="text-xs text-gray-600">Play sound when receiving notifications</p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, soundEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailEnabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, emailEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">SMS Notifications</label>
                      <p className="text-xs text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsEnabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, smsEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-xs text-gray-600">Receive push notifications on your device</p>
                    </div>
                    <Switch
                      checked={settings.pushEnabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({ ...prev, pushEnabled: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Notification Categories</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Appointments</label>
                      <p className="text-xs text-gray-600">Upcoming appointments and scheduling changes</p>
                    </div>
                    <Switch
                      checked={settings.categories.appointments}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, appointments: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Exercises</label>
                      <p className="text-xs text-gray-600">Exercise reminders and progress updates</p>
                    </div>
                    <Switch
                      checked={settings.categories.exercises}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, exercises: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Medications</label>
                      <p className="text-xs text-gray-600">Medication reminders and updates</p>
                    </div>
                    <Switch
                      checked={settings.categories.medications}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, medications: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">System Updates</label>
                      <p className="text-xs text-gray-600">System maintenance and feature updates</p>
                    </div>
                    <Switch
                      checked={settings.categories.system}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, system: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Progress Reports</label>
                      <p className="text-xs text-gray-600">Weekly and monthly progress summaries</p>
                    </div>
                    <Switch
                      checked={settings.categories.progress}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, progress: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">General Reminders</label>
                      <p className="text-xs text-gray-600">General health and wellness reminders</p>
                    </div>
                    <Switch
                      checked={settings.categories.reminders}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          categories: { ...prev.categories, reminders: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Quiet Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Enable Quiet Hours</label>
                      <p className="text-xs text-gray-600">Disable notifications during specified hours</p>
                    </div>
                    <Switch
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(checked) =>
                        setSettings(prev => ({
                          ...prev,
                          quietHours: { ...prev.quietHours, enabled: checked }
                        }))
                      }
                    />
                  </div>
                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Time</label>
                        <Input
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) =>
                            setSettings(prev => ({
                              ...prev,
                              quietHours: { ...prev.quietHours, start: e.target.value }
                            }))
                          }
                          className="bg-white/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">End Time</label>
                        <Input
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) =>
                            setSettings(prev => ({
                              ...prev,
                              quietHours: { ...prev.quietHours, end: e.target.value }
                            }))
                          }
                          className="bg-white/50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Notifications;