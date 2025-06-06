
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  Monitor,
  FileText,
  Clock,
  Play
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const PatientDashboard = () => {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Mock patient data
  const patientData = {
    name: 'Sarah Johnson',
    condition: 'ACL Recovery',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face',
    progressBadge: 'Week 8 of 12',
    overallProgress: 67
  };

  const progressMetrics = [
    { 
      label: 'Range of Motion', 
      current: 78, 
      target: 90, 
      unit: '°',
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      label: 'Pain Level', 
      current: 3, 
      target: 1, 
      unit: '/10',
      color: 'from-red-500 to-pink-500',
      inverse: true 
    },
    { 
      label: 'Strength', 
      current: 85, 
      target: 95, 
      unit: '%',
      color: 'from-green-500 to-emerald-500' 
    },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      date: 'Today',
      time: '2:30 PM',
      provider: 'Dr. Smith',
      type: 'Physical Therapy',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face',
      status: 'confirmed'
    },
    {
      id: '2',
      date: 'Tomorrow',
      time: '10:00 AM',
      provider: 'Dr. Johnson',
      type: 'AI Movement Analysis',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=40&h=40&fit=crop&crop=face',
      status: 'pending'
    },
  ];

  const todaysExercises = [
    {
      id: '1',
      name: 'Knee Flexion Stretch',
      duration: '10 minutes',
      reps: '3 sets of 15',
      difficulty: 'Medium',
      videoUrl: '#'
    },
    {
      id: '2',
      name: 'Quad Strengthening',
      duration: '15 minutes',
      reps: '3 sets of 20',
      difficulty: 'Hard',
      videoUrl: '#'
    },
    {
      id: '3',
      name: 'Balance Training',
      duration: '8 minutes',
      reps: '2 sets of 30s',
      difficulty: 'Easy',
      videoUrl: '#'
    },
  ];

  const sessionHistory = [
    {
      date: '2 days ago',
      type: 'Physical Therapy',
      provider: 'Dr. Smith',
      feedback: 'Excellent progress on range of motion. Continue current routine.',
      aiScore: 87
    },
    {
      date: '1 week ago',
      type: 'AI Analysis',
      provider: 'AI System',
      feedback: 'Movement asymmetry improved by 15%. Good posture maintenance.',
      aiScore: 82
    },
  ];

  const toggleExerciseCompletion = (exerciseId: string) => {
    setCompletedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const CircularProgress = ({ value, max, label, color, inverse = false }: any) => {
    const percentage = inverse ? ((max - value) / max) * 100 : (value / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`stop-color-blue-500`} />
              <stop offset="100%" className={`stop-color-cyan-500`} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold">{value}</span>
          <span className="text-xs text-gray-600">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16 border-4 border-white/20">
            <AvatarImage src={patientData.avatar} alt={patientData.name} />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Welcome back, {patientData.name}!</h1>
            <p className="text-blue-100 mt-1">{patientData.condition} • {patientData.progressBadge}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Overall Recovery Progress</span>
                <span>{patientData.overallProgress}%</span>
              </div>
              <Progress value={patientData.overallProgress} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Schedule Appointment', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
          { label: 'AI Movement Analysis', icon: Monitor, color: 'from-purple-500 to-pink-500' },
          { label: 'Start Exercises', icon: Activity, color: 'from-green-500 to-emerald-500' },
          { label: 'View Progress', icon: FileText, color: 'from-blue-500 to-indigo-500' }
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-sm font-medium">{action.label}</p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Progress Summary & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recovery Metrics</CardTitle>
              <CardDescription>Your current progress vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                {progressMetrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <CircularProgress
                      value={metric.current}
                      max={metric.target}
                      label={metric.unit}
                      color={metric.color}
                      inverse={metric.inverse}
                    />
                    <h4 className="font-medium mt-2">{metric.label}</h4>
                    <p className="text-sm text-gray-600">
                      {metric.current}{metric.unit} / {metric.target}{metric.unit}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={appointment.avatar} alt={appointment.provider} />
                      <AvatarFallback>{appointment.provider.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{appointment.provider}</h4>
                        <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Today's Exercises */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Today's Exercise Plan</span>
            </CardTitle>
            <CardDescription>Complete your daily routine to track progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysExercises.map((exercise) => {
                const isCompleted = completedExercises.includes(exercise.id);
                return (
                  <motion.div
                    key={exercise.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleExerciseCompletion(exercise.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'border-green-500 bg-green-500 text-white' 
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {isCompleted && <span className="text-xs">✓</span>}
                        </button>
                        <div>
                          <h4 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                            {exercise.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {exercise.duration} • {exercise.reps}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{exercise.difficulty}</Badge>
                        <Button variant="ghost" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Session History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionHistory.map((session, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{session.type}</h4>
                      <p className="text-sm text-gray-600">{session.provider} • {session.date}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Score: {session.aiScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{session.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PatientDashboard;
