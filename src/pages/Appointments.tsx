import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  provider: string;
  location: string;
  notes?: string;
  contact: {
    phone: string;
    email: string;
  };
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientAvatar: '/placeholder.svg',
    type: 'Initial Assessment',
    date: '2024-01-15',
    time: '10:00',
    duration: 60,
    status: 'scheduled',
    provider: 'Dr. Sarah Johnson',
    location: 'Room 101',
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com'
    },
    notes: 'First-time patient, knee injury from sports'
  },
  {
    id: '2',
    patientName: 'Lisa Wong',
    type: 'Follow-up Session',
    date: '2024-01-15',
    time: '14:30',
    duration: 45,
    status: 'completed',
    provider: 'Dr. Michael Chen',
    location: 'Room 203',
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'lisa.wong@email.com'
    },
    notes: 'Progress check for shoulder rehabilitation'
  },
  {
    id: '3',
    patientName: 'Robert Taylor',
    type: 'AI Analysis Review',
    date: '2024-01-16',
    time: '09:15',
    duration: 30,
    status: 'scheduled',
    provider: 'Dr. Sarah Johnson',
    location: 'Room 105',
    contact: {
      phone: '+1 (555) 456-7890',
      email: 'robert.taylor@email.com'
    },
    notes: 'Review AI movement analysis results'
  },
  {
    id: '4',
    patientName: 'Emma Davis',
    type: 'Physical Therapy',
    date: '2024-01-16',
    time: '11:00',
    duration: 60,
    status: 'no-show',
    provider: 'Dr. Michael Chen',
    location: 'Room 102',
    contact: {
      phone: '+1 (555) 321-0987',
      email: 'emma.davis@email.com'
    }
  }
];

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      case 'no-show':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = appointment.date === selectedDate;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const todayStats = {
    total: appointments.filter(apt => apt.date === selectedDate).length,
    completed: appointments.filter(apt => apt.date === selectedDate && apt.status === 'completed').length,
    scheduled: appointments.filter(apt => apt.date === selectedDate && apt.status === 'scheduled').length,
    cancelled: appointments.filter(apt => apt.date === selectedDate && (apt.status === 'cancelled' || apt.status === 'no-show')).length
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
            Appointment Manager
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => setShowNewAppointmentDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
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
                <p className="text-sm text-gray-600">Total Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.scheduled}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.cancelled}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <XCircle className="w-5 h-5 text-white" />
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
            placeholder="Search patients or appointment types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className="bg-white/70 backdrop-blur-sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'scheduled' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('scheduled')}
            className="bg-white/70 backdrop-blur-sm"
          >
            Scheduled
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completed')}
            className="bg-white/70 backdrop-blur-sm"
          >
            Completed
          </Button>
        </div>
      </motion.div>

      {/* Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredAppointments.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600">No appointments match your current filters for the selected date.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={appointment.patientAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                          <Badge className={`${getStatusColor(appointment.status)} border`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time} ({appointment.duration}min)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{appointment.provider}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">{appointment.type}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{appointment.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{appointment.contact.email}</span>
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
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Enter patient name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Appointment Type</label>
                <select className="w-full p-2 border rounded">
                  <option value="">Select type</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                  <option value="Occupational Therapy">Occupational Therapy</option>
                  <option value="Speech Therapy">Speech Therapy</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input type="time" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <select className="w-full p-2 border rounded">
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Provider</label>
                <select className="w-full p-2 border rounded">
                  <option value="">Select provider</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                  <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                  <option value="Dr. David Kim">Dr. David Kim</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select className="w-full p-2 border rounded">
                  <option value="">Select room</option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 102">Room 102</option>
                  <option value="Room 103">Room 103</option>
                  <option value="Gym Area">Gym Area</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="tel" className="w-full p-2 border rounded" placeholder="Patient phone number" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full p-2 border rounded" placeholder="Patient email address" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea className="w-full p-2 border rounded" rows={3} placeholder="Additional notes or special instructions"></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewAppointmentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Add logic to save new appointment here
                alert('New appointment scheduled successfully!');
                setShowNewAppointmentDialog(false);
              }}>
                Schedule Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;