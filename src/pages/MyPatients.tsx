import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Edit,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Patient {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: 'male' | 'female';
  condition: string;
  status: 'active' | 'inactive' | 'completed' | 'at-risk';
  progress: number;
  lastVisit: string;
  nextAppointment?: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  treatmentPlan: {
    startDate: string;
    duration: number; // weeks
    sessionsCompleted: number;
    totalSessions: number;
  };
  painLevel: number; // 1-10
  compliance: number; // percentage
  notes?: string;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    avatar: '/placeholder.svg',
    age: 45,
    gender: 'male',
    condition: 'Knee Injury - ACL Tear',
    status: 'active',
    progress: 75,
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-19',
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, City, State 12345'
    },
    treatmentPlan: {
      startDate: '2023-11-01',
      duration: 12,
      sessionsCompleted: 18,
      totalSessions: 24
    },
    painLevel: 3,
    compliance: 85,
    notes: 'Good progress, patient is motivated and following exercise plan'
  },
  {
    id: '2',
    name: 'Lisa Wong',
    age: 32,
    gender: 'female',
    condition: 'Shoulder Impingement',
    status: 'active',
    progress: 60,
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-17',
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'lisa.wong@email.com',
      address: '456 Oak Ave, City, State 12345'
    },
    treatmentPlan: {
      startDate: '2023-12-01',
      duration: 8,
      sessionsCompleted: 10,
      totalSessions: 16
    },
    painLevel: 4,
    compliance: 92,
    notes: 'Excellent compliance, showing steady improvement'
  },
  {
    id: '3',
    name: 'Robert Taylor',
    age: 58,
    gender: 'male',
    condition: 'Lower Back Pain',
    status: 'at-risk',
    progress: 35,
    lastVisit: '2024-01-05',
    nextAppointment: '2024-01-20',
    contact: {
      phone: '+1 (555) 456-7890',
      email: 'robert.taylor@email.com',
      address: '789 Pine St, City, State 12345'
    },
    treatmentPlan: {
      startDate: '2023-10-15',
      duration: 16,
      sessionsCompleted: 8,
      totalSessions: 20
    },
    painLevel: 7,
    compliance: 45,
    notes: 'Missed several appointments, needs motivation and support'
  },
  {
    id: '4',
    name: 'Emma Davis',
    age: 28,
    gender: 'female',
    condition: 'Ankle Sprain Recovery',
    status: 'completed',
    progress: 100,
    lastVisit: '2024-01-08',
    contact: {
      phone: '+1 (555) 321-0987',
      email: 'emma.davis@email.com',
      address: '321 Elm St, City, State 12345'
    },
    treatmentPlan: {
      startDate: '2023-11-15',
      duration: 6,
      sessionsCompleted: 12,
      totalSessions: 12
    },
    painLevel: 1,
    compliance: 98,
    notes: 'Treatment completed successfully, full recovery achieved'
  },
  {
    id: '5',
    name: 'Michael Chen',
    age: 41,
    gender: 'male',
    condition: 'Tennis Elbow',
    status: 'active',
    progress: 45,
    lastVisit: '2024-01-11',
    nextAppointment: '2024-01-18',
    contact: {
      phone: '+1 (555) 654-3210',
      email: 'michael.chen@email.com',
      address: '654 Maple Dr, City, State 12345'
    },
    treatmentPlan: {
      startDate: '2023-12-10',
      duration: 10,
      sessionsCompleted: 6,
      totalSessions: 15
    },
    painLevel: 5,
    compliance: 78,
    notes: 'Moderate progress, needs to focus on home exercises'
  }
];

const MyPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at-risk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-3 h-3" />;
      case 'inactive':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'at-risk':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-blue-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.progress - a.progress;
      case 'lastVisit':
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      case 'painLevel':
        return b.painLevel - a.painLevel;
      default:
        return 0;
    }
  });

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    atRisk: patients.filter(p => p.status === 'at-risk').length,
    completed: patients.filter(p => p.status === 'completed').length,
    avgProgress: Math.round(patients.reduce((sum, p) => sum + p.progress, 0) / patients.length)
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
            My Patients
          </h1>
          <p className="text-gray-600 mt-1">Manage and track patient progress and treatments</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={() => setShowAddPatientDialog(true)}
        >
          <User className="w-4 h-4 mr-2" />
          Add New Patient
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-red-600">{stats.atRisk}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border-0 shadow-lg"
          >
            <option value="name">Sort by Name</option>
            <option value="progress">Sort by Progress</option>
            <option value="lastVisit">Sort by Last Visit</option>
            <option value="painLevel">Sort by Pain Level</option>
          </select>
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className="bg-white/70 backdrop-blur-sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            className="bg-white/70 backdrop-blur-sm"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'at-risk' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('at-risk')}
            className="bg-white/70 backdrop-blur-sm"
          >
            At Risk
          </Button>
        </div>
      </motion.div>

      {/* Patients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {sortedPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={patient.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getStatusColor(patient.status)} border`}>
                      {getStatusIcon(patient.status)}
                      <span className="ml-1 capitalize">{patient.status.replace('-', ' ')}</span>
                    </Badge>
                    <span className={`text-sm font-medium ${getPainLevelColor(patient.painLevel)}`}>
                      Pain: {patient.painLevel}/10
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{patient.condition}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Progress: {patient.progress}%</span>
                      <span>Compliance: {patient.compliance}%</span>
                    </div>
                    <Progress value={patient.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Last: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                    </div>
                    {patient.nextAppointment && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-1 mb-1">
                      <Activity className="w-3 h-3" />
                      <span>Sessions: {patient.treatmentPlan.sessionsCompleted}/{patient.treatmentPlan.totalSessions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{patient.contact.phone}</span>
                    </div>
                  </div>

                  {patient.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-xs text-gray-600">{patient.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {sortedPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">No patients match your current search and filter criteria.</p>
        </motion.div>
      )}

      {/* Add New Patient Dialog */}
      <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>
              Add a new patient to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter patient name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="Age" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select className="w-full p-2 border rounded">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Medical Condition</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Primary condition" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full p-2 border rounded">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                  <option value="at-risk">At Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" className="w-full p-2 border rounded" placeholder="Phone number" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="Email address" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Full address" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Next Appointment</label>
                <input type="datetime-local" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Initial Progress (%)</label>
                <input type="number" className="w-full p-2 border rounded" placeholder="0-100" min="0" max="100" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea className="w-full p-2 border rounded" rows={3} placeholder="Additional notes about the patient"></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Add logic to save new patient here
                alert('New patient added successfully!');
                setShowAddPatientDialog(false);
              }}>
                Add Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPatients;