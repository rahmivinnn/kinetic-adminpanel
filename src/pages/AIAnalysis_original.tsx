import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  Share,
  Calendar,
  Clock,
  Target,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  FileText,
  Video
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AnalysisSession {
  id: string;
  patientName: string;
  exerciseType: string;
  date: string;
  duration: number; // minutes
  status: 'completed' | 'processing' | 'failed';
  accuracy: number; // percentage
  improvements: string[];
  concerns: string[];
  overallScore: number; // 1-100
  videoUrl?: string;
  reportUrl?: string;
}

interface MovementMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  trend: 'up' | 'down' | 'stable';
  target: number;
}

interface AIInsight {
  id: string;
  type: 'improvement' | 'concern' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

const mockSessions: AnalysisSession[] = [
  {
    id: '1',
    patientName: 'John Smith',
    exerciseType: 'Knee Flexion',
    date: '2024-01-15',
    duration: 12,
    status: 'completed',
    accuracy: 87,
    improvements: [
      'Range of motion increased by 15°',
      'Movement consistency improved',
      'Pain level decreased during exercise'
    ],
    concerns: [
      'Slight compensation in hip movement',
      'Speed variation in repetitions'
    ],
    overallScore: 82,
    videoUrl: '/placeholder-video.mp4',
    reportUrl: '/placeholder-report.pdf'
  },
  {
    id: '2',
    patientName: 'Lisa Wong',
    exerciseType: 'Shoulder Abduction',
    date: '2024-01-14',
    duration: 8,
    status: 'completed',
    accuracy: 92,
    improvements: [
      'Perfect form maintained throughout',
      'Smooth movement pattern',
      'Excellent range of motion'
    ],
    concerns: [],
    overallScore: 94,
    videoUrl: '/placeholder-video.mp4',
    reportUrl: '/placeholder-report.pdf'
  },
  {
    id: '3',
    patientName: 'Robert Taylor',
    exerciseType: 'Balance Assessment',
    date: '2024-01-13',
    duration: 15,
    status: 'processing',
    accuracy: 0,
    improvements: [],
    concerns: [],
    overallScore: 0
  }
];

const mockMetrics: MovementMetric[] = [
  {
    name: 'Range of Motion',
    value: 125,
    unit: '°',
    status: 'good',
    trend: 'up',
    target: 130
  },
  {
    name: 'Movement Speed',
    value: 2.3,
    unit: 'sec/rep',
    status: 'warning',
    trend: 'stable',
    target: 2.0
  },
  {
    name: 'Stability Score',
    value: 78,
    unit: '%',
    status: 'good',
    trend: 'up',
    target: 85
  },
  {
    name: 'Symmetry Index',
    value: 0.85,
    unit: 'ratio',
    status: 'warning',
    trend: 'down',
    target: 0.95
  },
  {
    name: 'Effort Level',
    value: 6.2,
    unit: '/10',
    status: 'good',
    trend: 'stable',
    target: 6.0
  },
  {
    name: 'Consistency',
    value: 89,
    unit: '%',
    status: 'good',
    trend: 'up',
    target: 90
  }
];

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Significant Progress Detected',
    description: 'Patient has shown 25% improvement in knee flexion range over the past week.',
    priority: 'high',
    actionable: false
  },
  {
    id: '2',
    type: 'concern',
    title: 'Movement Compensation Pattern',
    description: 'AI detected hip hiking during knee exercises. Consider addressing hip stability.',
    priority: 'medium',
    actionable: true
  },
  {
    id: '3',
    type: 'improvement',
    title: 'Exercise Modification Suggestion',
    description: 'Based on movement analysis, consider increasing resistance for optimal challenge.',
    priority: 'low',
    actionable: true
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Perfect Form Milestone',
    description: 'Patient achieved 95% movement accuracy in last 3 sessions.',
    priority: 'medium',
    actionable: false
  }
];

const AIAnalysis: React.FC = () => {
  const [sessions, setSessions] = useState<AnalysisSession[]>(mockSessions);
  const [metrics, setMetrics] = useState<MovementMetric[]>(mockMetrics);
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecording, setIsRecording] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-blue-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'concern':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'improvement':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default:
        return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-green-50 border-green-200';
      case 'concern':
        return 'bg-blue-50 border-blue-200';
      case 'improvement':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleInsightAction = (insightId: string, action: string) => {
    console.log(`Action ${action} for insight ${insightId}`);
    // Handle insight actions here
  };

  const stats = {
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.status === 'completed').length,
    avgAccuracy: sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.accuracy, 0) / sessions.filter(s => s.status === 'completed').length || 0,
    avgScore: sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.overallScore, 0) / sessions.filter(s => s.status === 'completed').length || 0,
    activeInsights: insights.filter(i => i.actionable).length
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
            AI Movement Analysis
          </h1>
          <p className="text-gray-600 mt-1">Advanced motion analysis and rehabilitation insights</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="bg-white/70 backdrop-blur-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
          <Button 
            className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
        </div>
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
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedSessions}</p>
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
                <p className="text-sm text-gray-600">Avg Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgAccuracy.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.avgScore.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Insights</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeInsights}</p>
              </div>
              <div className="mt-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
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
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Analysis */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{session.exerciseType}</p>
                        <p className="text-sm text-gray-600">{session.patientName}</p>
                        <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(session.status)} border mb-1`}>
                          {session.status}
                        </Badge>
                        {session.status === 'completed' && (
                          <p className="text-sm font-medium text-gray-900">{session.overallScore}/100</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Key Metrics Summary */}
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metrics.slice(0, 4).map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getMetricStatusColor(metric.status)}`}>
                          {metric.value}{metric.unit}
                        </p>
                        <p className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Progress Chart Placeholder */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Progress Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive progress charts would be displayed here</p>
                    <p className="text-sm text-gray-500">Showing movement trends over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{metric.name}</h3>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-end gap-2">
                          <span className={`text-3xl font-bold ${getMetricStatusColor(metric.status)}`}>
                            {metric.value}
                          </span>
                          <span className="text-gray-600 text-sm mb-1">{metric.unit}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Target</span>
                            <span className="text-gray-900">{metric.target}{metric.unit}</span>
                          </div>
                          <Progress 
                            value={(metric.value / metric.target) * 100} 
                            className="h-2"
                          />
                        </div>
                        <Badge className={`${getStatusColor(metric.status === 'good' ? 'completed' : metric.status === 'warning' ? 'processing' : 'failed')} border text-xs`}>
                          {metric.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{session.exerciseType}</h3>
                            <Badge className={`${getStatusColor(session.status)} border`}>
                              {session.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{session.duration} minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>Patient: {session.patientName}</span>
                            </div>
                          </div>
                          
                          {session.status === 'completed' && (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">Improvements:</p>
                                  <ul className="text-sm text-green-600 space-y-1">
                                    {session.improvements.map((improvement, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        {improvement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {session.concerns.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Areas for Attention:</p>
                                    <ul className="text-sm text-blue-600 space-y-1">
                                      {session.concerns.map((concern, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                          <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                          {concern}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{session.accuracy}%</p>
                                    <p className="text-xs text-gray-600">Accuracy</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">{session.overallScore}</p>
                                    <p className="text-xs text-gray-600">Overall Score</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  {session.videoUrl && (
                                    <Button size="sm" variant="outline">
                                      <Video className="w-4 h-4 mr-1" />
                                      View Video
                                    </Button>
                                  )}
                                  {session.reportUrl && (
                                    <Button size="sm" variant="outline">
                                      <FileText className="w-4 h-4 mr-1" />
                                      Report
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4 mr-1" />
                                    Export
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${getInsightColor(insight.type)} border-l-4 shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {insight.priority} priority
                            </Badge>
                            {insight.actionable && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Actionable
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-700 mb-3">{insight.description}</p>
                          {insight.actionable && (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                                Take Action
                              </Button>
                              <Button size="sm" variant="outline">
                                Learn More
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AIAnalysis;