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
  RefreshCw,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder' | 'appointment' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  sender?: string;
  actionRequired?: boolean;
  relatedEntity?: {
    type: 'patient' | 'appointment' | 'exercise' | 'report';
    id: string;
    name: string;
  };
  channels: ('email' | 'sms' | 'push' | 'in-app')[];
}

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
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
    patientUpdates: boolean;
    reports: boolean;
    emergencies: boolean;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'You have an appointment with John Smith in 30 minutes (10:00 AM)',
    type: 'appointment',
    priority: 'high',
    timestamp: '2024-01-15T09:30:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    sender: 'System',
    actionRequired: true,
    relatedEntity: {
      type: 'appointment',
      id: 'apt-001',
      name: 'John Smith - Initial Assessment'
    },
    channels: ['email', 'push', 'in-app']
  },
  {
    id: '2',
    title: 'Patient Progress Update',
    message: 'Lisa Wong has completed her daily exercises with 95% accuracy',
    type: 'success',
    priority: 'medium',
    timestamp: '2024-01-15T08:45:00Z',
    isRead: false,
    isStarred: false,
    isArchived: false,
    sender: 'AI Analysis System',
    actionRequired: false,
    relatedEntity: {
      type: 'patient',
      id: 'pat-002',
      name: 'Lisa Wong'
    },
    channels: ['in-app']
  },
  {
    id: '3',
    title: 'System Maintenance Alert',
    message: 'Scheduled maintenance will occur tonight from 11 PM to 2 AM. Some features may be unavailable.',
    type: 'warning',
    priority: 'medium',
    timestamp: '2024-01-15T07:00:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    sender: 'System Administrator',
    actionRequired: false,
    channels: ['email', 'in-app']
  },
  {
    id: '4',
    title: 'Exercise Plan Updated',
    message: 'Robert Taylor\'s exercise plan has been modified based on recent progress analysis',
    type: 'info',
    priority: 'low',
    timestamp: '2024-01-15T06:30:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    sender: 'Dr. Johnson',
    actionRequired: true,
    relatedEntity: {
      type: 'exercise',
      id: 'ex-003',
      name: 'Robert Taylor - Updated Plan'
    },
    channels: ['email', 'in-app']
  },
  {
    id: '5',
    title: 'Critical Alert: Patient Missed Session',
    message: 'Sarah Davis has missed 3 consecutive therapy sessions. Immediate follow-up required.',
    type: 'error',
    priority: 'urgent',
    timestamp: '2024-01-14T16:00:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    sender: 'Compliance Monitor',
    actionRequired: true,
    relatedEntity: {
      type: 'patient',
      id: 'pat-004',
      name: 'Sarah Davis'
    },
    channels: ['email', 'sms', 'push', 'in-app']
  },
  {
    id: '6',
    title: 'Weekly Report Generated',
    message: 'Your weekly clinic performance report is ready for review',
    type: 'info',
    priority: 'low',
    timestamp: '2024-01-14T09:00:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    sender: 'Report Generator',
    actionRequired: false,
    relatedEntity: {
      type: 'report',
      id: 'rep-001',
      name: 'Weekly Performance Report'
    },
    channels: ['email', 'in-app']
  },
  {
    id: '7',
    title: 'New Patient Registration',
    message: 'Michael Chen has registered and is awaiting initial assessment scheduling',
    type: 'info',
    priority: 'medium',
    timestamp: '2024-01-13T14:20:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    sender: 'Registration System',
    actionRequired: true,
    relatedEntity: {
      type: 'patient',
      id: 'pat-005',
      name: 'Michael Chen'
    },
    channels: ['email', 'in-app']
  }
];

const mockSettings: NotificationSettings = {
  emailEnabled: true,
  smsEnabled: true,
  pushEnabled: true,
  inAppEnabled: true,
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
    patientUpdates: true,
    reports: false,
    emergencies: true
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
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reminder':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'appointment':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'reminder':
        return <Clock className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-3 h-3" />;
      case 'sms':
        return <MessageSquare className="w-3 h-3" />;
      case 'push':
        return <Smartphone className="w-3 h-3" />;
      case 'in-app':
        return <Bell className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
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
          <p className="text-gray-600 mt-1">Manage your notifications and communication preferences</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            className="bg-white/70 backdrop-blur-sm"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
              <div className="mt-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <BellRing className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-bold text-purple-600">{stats.starred}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                >
                  <option value="all">All Types</option>
                  <option value="appointment">Appointments</option>
                  <option value="reminder">Reminders</option>
                  <option value="info">Information</option>
                  <option value="warning">Warnings</option>
                  <option value="error">Errors</option>
                  <option value="success">Success</option>
                  <option value="system">System</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                  <Switch
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <span className="text-sm text-gray-600">Unread only</span>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
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
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon and Read Status */}
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-2 rounded-lg ${
                            notification.isRead ? 'bg-gray-100' : 'bg-blue-100'
                          }`}>
                            {getTypeIcon(notification.type)}
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${
                                  notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </h3>
                                <Badge className={`${getTypeColor(notification.type)} border text-xs`}>
                                  {notification.type}
                                </Badge>
                                <Badge className={`${getPriorityColor(notification.priority)} border text-xs`}>
                                  {notification.priority}
                                </Badge>
                                {notification.actionRequired && (
                                  <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <p className={`text-sm mb-2 ${
                                notification.isRead ? 'text-gray-600' : 'text-gray-800'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimestamp(notification.timestamp)}</span>
                                </div>
                                {notification.sender && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{notification.sender}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  {notification.channels.map((channel, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                      {getChannelIcon(channel)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {notification.relatedEntity && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {notification.relatedEntity.type}: {notification.relatedEntity.name}
                                  </Badge>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleStar(notification.id)}
                                className="p-1 h-auto"
                              >
                                {notification.isStarred ? (
                                  <Star className="w-4 h-4 text-blue-500 fill-current" />
                                ) : (
                                  <StarOff className="w-4 h-4 text-gray-400" />
                                )}
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="p-1 h-auto">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {notification.isRead ? (
                                    <DropdownMenuItem onClick={() => markAsUnread(notification.id)}>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Mark as Unread
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Mark as Read
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                    <Archive className="w-4 h-4 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Notification Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Settings */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Notification Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span>Email Notifications</span>
                    </div>
                    <Switch
                      checked={settings.emailEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4 text-gray-600" />
                      <span>SMS Notifications</span>
                    </div>
                    <Switch
                      checked={settings.smsEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, smsEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-gray-600" />
                      <span>Push Notifications</span>
                    </div>
                    <Switch
                      checked={settings.pushEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, pushEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-gray-600" />
                      <span>In-App Notifications</span>
                    </div>
                    <Switch
                      checked={settings.inAppEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, inAppEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.soundEnabled ? (
                        <Volume2 className="w-4 h-4 text-gray-600" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-600" />
                      )}
                      <span>Sound Notifications</span>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, soundEnabled: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Category Settings */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Notification Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span>Appointments</span>
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
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span>Reminders</span>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span>System Updates</span>
                    </div>
                    <Switch
                      checked={settings.categories.systemUpdates}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          categories: { ...prev.categories, systemUpdates: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-600" />
                      <span>Patient Updates</span>
                    </div>
                    <Switch
                      checked={settings.categories.patientUpdates}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          categories: { ...prev.categories, patientUpdates: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>Reports</span>
                    </div>
                    <Switch
                      checked={settings.categories.reports}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          categories: { ...prev.categories, reports: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-gray-600" />
                      <span>Emergencies</span>
                    </div>
                    <Switch
                      checked={settings.categories.emergencies}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          categories: { ...prev.categories, emergencies: checked }
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  <span>Enable Quiet Hours</span>
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            quietHours: { ...prev.quietHours, start: e.target.value }
                          }))
                        }
                        className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            quietHours: { ...prev.quietHours, end: e.target.value }
                          }))
                        }
                        className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Notifications;