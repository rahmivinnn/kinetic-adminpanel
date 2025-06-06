import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, DollarSign, TrendingUp, Activity, Calendar, MapPin, Star,
  Filter, Search, Download, Upload, RefreshCw, Settings, Bell,
  BarChart3, PieChart, LineChart, Database, Shield, Zap,
  Globe, Smartphone, Laptop, Server, Cloud, Lock,
  CheckCircle, AlertTriangle, XCircle, Clock,
  ArrowUp, ArrowDown, Eye, Edit, Trash2, Plus,
  FileText, Image, Video, Music, Archive
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Interfaces untuk data types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'provider' | 'patient';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  totalSessions: number;
  revenue: number;
  location: string;
  avatar: string;
  joinDate: string;
  subscription: 'free' | 'premium' | 'enterprise';
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'subscription' | 'session' | 'equipment' | 'consultation';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  description: string;
  paymentMethod: string;
}

interface Analytics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeUsers: number;
  totalSessions: number;
  conversionRate: number;
  avgSessionDuration: number;
  customerSatisfaction: number;
  serverUptime: number;
}

const SuperAdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Generate massive realistic data
  const generateUsers = (count: number): User[] => {
    const roles = ['admin', 'provider', 'patient'] as const;
    const statuses = ['active', 'inactive', 'suspended'] as const;
    const subscriptions = ['free', 'premium', 'enterprise'] as const;
    const locations = [
      'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
      'Palembang', 'Tangerang', 'Depok', 'Bekasi', 'Bogor', 'Batam'
    ];
    const firstNames = [
      'Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gunawan', 'Hani',
      'Indra', 'Joko', 'Kartika', 'Lina', 'Made', 'Nina', 'Omar', 'Putri',
      'Qori', 'Rina', 'Sari', 'Tono', 'Umar', 'Vina', 'Wati', 'Yani', 'Zaki'
    ];
    const lastNames = [
      'Pratama', 'Sari', 'Wijaya', 'Kusuma', 'Santoso', 'Permata', 'Cahaya',
      'Indah', 'Jaya', 'Mulia', 'Utama', 'Sejati', 'Bahagia', 'Sukses'
    ];

    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const subscription = subscriptions[Math.floor(Math.random() * subscriptions.length)];
      
      return {
        id: `user_${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@kineticai.com`,
        role,
        status,
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalSessions: Math.floor(Math.random() * 500) + 1,
        revenue: Math.floor(Math.random() * 50000000) + 100000, // 100k - 50M
        location: locations[Math.floor(Math.random() * locations.length)],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        subscription
      };
    });
  };

  const generateTransactions = (count: number): Transaction[] => {
    const types = ['subscription', 'session', 'equipment', 'consultation'] as const;
    const statuses = ['completed', 'pending', 'failed', 'refunded'] as const;
    const paymentMethods = ['Credit Card', 'Bank Transfer', 'E-Wallet', 'Cash', 'Insurance'];
    const descriptions = [
      'Premium Subscription Renewal',
      'Physical Therapy Session',
      'Equipment Rental - Treadmill',
      'Online Consultation',
      'Group Therapy Session',
      'Specialized Equipment Purchase',
      'Extended Therapy Package',
      'Emergency Consultation',
      'Home Visit Service',
      'Rehabilitation Assessment'
    ];

    return Array.from({ length: count }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        id: `txn_${i + 1}`,
        userId: `user_${Math.floor(Math.random() * 1000) + 1}`,
        userName: `User ${Math.floor(Math.random() * 1000) + 1}`,
        amount: Math.floor(Math.random() * 5000000) + 50000, // 50k - 5M
        type,
        status,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      };
    });
  };

  // Generate data
  const [users] = useState(() => generateUsers(50000)); // 50,000 users
  const [transactions] = useState(() => generateTransactions(100000)); // 100,000 transactions
  
  const analytics: Analytics = {
    totalRevenue: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    monthlyGrowth: 23.5,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalSessions: users.reduce((sum, u) => sum + u.totalSessions, 0),
    conversionRate: 12.8,
    avgSessionDuration: 45.2,
    customerSatisfaction: 4.7,
    serverUptime: 99.97
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
    toast.success('🔄 Data updated successfully!', {
      description: 'All data has been synchronized with the server',
      duration: 3000
    });
  };

  const handleExport = () => {
    toast.success('📊 Export started!', {
      description: 'File will be downloaded in a few seconds',
      duration: 3000
    });
  };

  const handleAddUser = () => {
    toast.success('👤 Add User dialog opened!', {
      description: 'Form to add new user will be displayed',
      duration: 3000
    });
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast.success('✏️ Edit User', {
      description: `Opening edit form for ${user?.name}`,
      duration: 2000
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast.success('🗑️ Delete User', {
      description: `Confirming deletion of ${user?.name}`,
      duration: 2000
    });
  };

  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    toast.success('👁️ View User Details', {
      description: `Opening profile for ${user?.name}`,
      duration: 2000
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Super Duper Admin Panel
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola {formatNumber(users.length)} pengguna dan {formatNumber(transactions.length)} transaksi bernilai {formatCurrency(analytics.totalRevenue)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUp className="w-4 h-4 text-green-300" />
                    <span className="text-green-300 text-sm ml-1">+{analytics.monthlyGrowth}%</span>
                  </div>
                </div>
                <DollarSign className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Users</p>
                  <p className="text-3xl font-bold">{formatNumber(analytics.activeUsers)}</p>
                  <div className="flex items-center mt-2">
                    <Users className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-200 text-sm ml-1">dari {formatNumber(users.length)}</span>
                  </div>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Sessions</p>
                  <p className="text-3xl font-bold">{formatNumber(analytics.totalSessions)}</p>
                  <div className="flex items-center mt-2">
                    <Activity className="w-4 h-4 text-green-200" />
                    <span className="text-green-200 text-sm ml-1">Avg: {analytics.avgSessionDuration}min</span>
                  </div>
                </div>
                <Activity className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Satisfaction</p>
                  <p className="text-3xl font-bold">{analytics.customerSatisfaction}/5.0</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-orange-200 fill-current" />
                    <span className="text-orange-200 text-sm ml-1">{analytics.serverUptime}% uptime</span>
                  </div>
                </div>
                <Star className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Revenue Trend</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-600">Interactive Revenue Chart</p>
                        <p className="text-sm text-gray-500 mt-2">Growth: +{analytics.monthlyGrowth}% this month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="w-5 h-5" />
                      <span>User Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Patients</span>
                        <span className="text-sm text-gray-600">{formatNumber(users.filter(u => u.role === 'patient').length)}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Providers</span>
                        <span className="text-sm text-gray-600">{formatNumber(users.filter(u => u.role === 'provider').length)}</span>
                      </div>
                      <Progress value={20} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Admins</span>
                        <span className="text-sm text-gray-600">{formatNumber(users.filter(u => u.role === 'admin').length)}</span>
                      </div>
                      <Progress value={5} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Recent High-Value Transactions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-500' :
                            transaction.status === 'pending' ? 'bg-yellow-500' :
                            transaction.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{transaction.userName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Cari pengguna..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button size="sm" onClick={handleAddUser}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Users ({formatNumber(filteredUsers.length)})</CardTitle>
                  <CardDescription>
                    Menampilkan {formatNumber(Math.min(20, filteredUsers.length))} dari {formatNumber(filteredUsers.length)} pengguna
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">User</th>
                          <th className="text-left p-4">Role</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Revenue</th>
                          <th className="text-left p-4">Sessions</th>
                          <th className="text-left p-4">Last Login</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.slice(0, 20).map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'provider' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="p-4 font-medium text-green-600">
                              {formatCurrency(user.revenue)}
                            </td>
                            <td className="p-4">{formatNumber(user.totalSessions)}</td>
                            <td className="p-4 text-sm text-gray-600">
                              {new Date(user.lastLogin).toLocaleDateString('id-ID')}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" onClick={() => handleViewUser(user.id)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>High-Value Transactions</CardTitle>
                  <CardDescription>
                    Total: {formatCurrency(analytics.totalRevenue)} dari {formatNumber(transactions.length)} transaksi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 15).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-500' :
                            transaction.status === 'pending' ? 'bg-yellow-500' :
                            transaction.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {transaction.userName} • {transaction.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Conversion Rate</span>
                      <span className="font-bold">{analytics.conversionRate}%</span>
                    </div>
                    <Progress value={analytics.conversionRate} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Server Uptime</span>
                      <span className="font-bold">{analytics.serverUptime}%</span>
                    </div>
                    <Progress value={analytics.serverUptime} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span>Customer Satisfaction</span>
                      <span className="font-bold">{analytics.customerSatisfaction}/5.0</span>
                    </div>
                    <Progress value={(analytics.customerSatisfaction / 5) * 100} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Revenue Growth Chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="w-12 h-12 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Engagement Metrics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Server className="w-5 h-5" />
                      <span>System Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Database</span>
                      </div>
                      <Badge variant="default">Online</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>API Services</span>
                      </div>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span>Background Jobs</span>
                      </div>
                      <Badge variant="secondary">Warning</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>CDN</span>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Security Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>SSL Certificate</span>
                      <Badge variant="default">Valid</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Firewall Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Last Security Scan</span>
                      <span className="text-sm text-gray-600">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Failed Login Attempts</span>
                      <span className="text-sm text-red-600">23 (last 24h)</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;