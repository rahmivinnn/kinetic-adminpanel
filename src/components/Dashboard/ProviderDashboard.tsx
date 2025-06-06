
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  User, 
  Bell, 
  Monitor,
  FileText,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProviderDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Mock data
  const overviewStats = [
    { title: 'Total Patients', value: '127', change: '+12%', icon: User, color: 'bg-blue-500' },
    { title: "Today's Appointments", value: '8', change: '+2', icon: Calendar, color: 'bg-green-500' },
    { title: 'Active Exercises', value: '45', change: '+5', icon: Activity, color: 'bg-purple-500' },
    { title: 'Recovery Alerts', value: '3', change: 'urgent', icon: Bell, color: 'bg-red-500' },
  ];

  const patients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 34,
      condition: 'ACL Recovery',
      painScore: 3,
      lastSession: '2 hours ago',
      progress: 78,
      riskLevel: 'low',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Michael Chen',
      age: 45,
      condition: 'Shoulder Impingement',
      painScore: 8,
      lastSession: '1 day ago',
      progress: 45,
      riskLevel: 'high',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Emma Davis',
      age: 28,
      condition: 'Back Pain',
      painScore: 5,
      lastSession: '3 hours ago',
      progress: 92,
      riskLevel: 'medium',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
  ];

  const chartData = [
    { month: 'Jan', rom: 65, pain: 7, strength: 45 },
    { month: 'Feb', rom: 72, pain: 6, strength: 52 },
    { month: 'Mar', rom: 78, pain: 5, strength: 58 },
    { month: 'Apr', rom: 85, pain: 4, strength: 65 },
    { month: 'May', rom: 89, pain: 3, strength: 72 },
    { month: 'Jun', rom: 94, pain: 2, strength: 78 },
  ];

  const pendingAppointments = [
    { id: '1', patient: 'John Smith', time: '10:00 AM', type: 'Initial Assessment', status: 'pending' },
    { id: '2', patient: 'Lisa Wong', time: '2:30 PM', type: 'Follow-up', status: 'pending' },
    { id: '3', patient: 'Robert Taylor', time: '4:00 PM', type: 'AI Analysis Review', status: 'pending' },
  ];

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Dr. Smith</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.change.includes('+') ? 'text-green-600' : stat.change === 'urgent' ? 'text-red-600' : 'text-gray-500'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>My Patients</span>
              </CardTitle>
              <CardDescription>Current patient status and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <motion.div
                    key={patient.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedPatient(patient.id)}
                    className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                          <Badge className={getRiskBadgeColor(patient.riskLevel)}>
                            {patient.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{patient.condition} • Age {patient.age}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{patient.progress}%</span>
                          </div>
                          <Progress value={patient.progress} className="h-1" />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className={`text-${patient.painScore > 7 ? 'red' : patient.painScore > 4 ? 'amber' : 'green'}-600`}>
                            Pain: {patient.painScore}/10
                          </span>
                          <span className="text-gray-500">Last: {patient.lastSession}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5" />
                <span>Patient Metrics</span>
              </CardTitle>
              <CardDescription>Recovery progress trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="rom" stroke="#3b82f6" strokeWidth={2} name="Range of Motion" />
                    <Line type="monotone" dataKey="pain" stroke="#ef4444" strokeWidth={2} name="Pain Score" />
                    <Line type="monotone" dataKey="strength" stroke="#10b981" strokeWidth={2} name="Strength Index" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Appointment Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Appointment Manager</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending ({pendingAppointments.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-4 mt-4">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <h4 className="font-medium">{appointment.patient}</h4>
                        <p className="text-sm text-gray-600">{appointment.type} • {appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Reschedule</Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">Approve</Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Analysis Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-5 h-5" />
              <span>AI Movement Analysis</span>
            </CardTitle>
            <CardDescription>OpenPose integration and movement feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Upload Patient Video</h3>
                  <p className="text-sm text-gray-600 mb-4">Drag and drop or click to select movement video</p>
                  <Button variant="outline">Select Video</Button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Recent AI Analysis</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-900">Sarah Johnson</p>
                        <p className="text-sm text-green-700">Posture Score: 87%</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Good</Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-blue-900">Michael Chen</p>
                    <p className="text-sm text-blue-700">Movement Asymmetry: 23%</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-300">Review</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProviderDashboard;
