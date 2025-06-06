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

// Mock data
const mockSessions: AnalysisSession[] = [
  {
    id: '1',
    patientName: 'John Doe',
    exerciseType: 'Shoulder Rehabilitation',
    date: '2024-01-15',
    duration: 45,
    status: 'completed',
    accuracy: 87,
    improvements: ['Better range of motion', 'Improved stability'],
    concerns: ['Slight compensation in movement'],
    overallScore: 85,
    videoUrl: '/videos/session1.mp4',
    reportUrl: '/reports/session1.pdf'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    exerciseType: 'Knee Recovery',
    date: '2024-01-14',
    duration: 30,
    status: 'processing',
    accuracy: 0,
    improvements: [],
    concerns: [],
    overallScore: 0
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    exerciseType: 'Balance Training',
    date: '2024-01-13',
    duration: 25,
    status: 'completed',
    accuracy: 92,
    improvements: ['Excellent balance control', 'Consistent performance'],
    concerns: [],
    overallScore: 94
  }
];

const mockMetrics: MovementMetric[] = [
  {
    name: 'Range of Motion',
    value: 85,
    unit: '°',
    status: 'good',
    trend: 'up',
    target: 90
  },
  {
    name: 'Movement Speed',
    value: 72,
    unit: 'cm/s',
    status: 'warning',
    trend: 'stable',
    target: 80
  },
  {
    name: 'Stability Index',
    value: 88,
    unit: '%',
    status: 'good',
    trend: 'up',
    target: 85
  },
  {
    name: 'Compensation Score',
    value: 15,
    unit: '%',
    status: 'good',
    trend: 'down',
    target: 10
  }
];

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'improvement',
    title: 'Significant Progress in Range of Motion',
    description: 'Patient has shown 15% improvement in shoulder flexion over the past week.',
    priority: 'high',
    actionable: true
  },
  {
    id: '2',
    type: 'concern',
    title: 'Compensation Pattern Detected',
    description: 'AI detected slight compensation in hip movement during knee exercises.',
    priority: 'medium',
    actionable: true
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Consistency Milestone Reached',
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
    const insight = insights.find(i => i.id === insightId);
    if (action === 'view') {
      alert(`👁️ Viewing details for: ${insight?.title}`);
    }
  };

  const handleShareWithTeam = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    alert(`🤝 Sharing insight with team: ${insight?.title}`);
  };

  const handleViewDetails = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    alert(`📋 Viewing detailed analysis for: ${insight?.title}`);
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
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Movement Analysis</h1>
          <p className="text-gray-600">Advanced motion capture and analysis powered by artificial intelligence</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsRecording(!isRecording)}
            className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
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
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
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

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
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

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Insights</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeInsights}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
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
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Sessions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Analysis Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Video className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.patientName}</h4>
                          <p className="text-sm text-gray-600">{session.exerciseType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{session.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Key Movement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.slice(0, 4).map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm font-medium ${getMetricStatusColor(metric.status)}`}>
                            {metric.value}{metric.unit}
                          </span>
                        </div>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                      <p className="text-xs text-gray-500">Target: {metric.target}{metric.unit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Analysis Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{session.patientName}</h3>
                          <p className="text-gray-600">{session.exerciseType}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{session.date}</p>
                        </div>
                      </div>
                      
                      {session.status === 'completed' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-2xl font-bold text-blue-600">{session.accuracy}%</p>
                              <p className="text-sm text-gray-600">Accuracy</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">{session.overallScore}</p>
                              <p className="text-sm text-gray-600">Overall Score</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <p className="text-2xl font-bold text-purple-600">{session.duration}min</p>
                              <p className="text-sm text-gray-600">Duration</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-green-700 mb-2">Improvements</h4>
                              <ul className="space-y-1">
                                {session.improvements.map((improvement, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-blue-700 mb-2">Areas for Focus</h4>
                              <ul className="space-y-1">
                                {session.concerns.map((concern, index) => (
                                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3 text-blue-500" />
                                    {concern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Video
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Movement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <Badge className={getMetricStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900">
                            {metric.value}{metric.unit}
                          </p>
                          <p className="text-sm text-gray-600">Current Value</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress to Target</span>
                            <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(metric.value / metric.target) * 100} className="h-3" />
                          <p className="text-xs text-gray-500 text-center">
                            Target: {metric.target}{metric.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div key={insight.id} className={`border rounded-lg p-6 ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getInsightIcon(insight.type)}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {insight.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {insight.priority} priority
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {insight.actionable && (
                          <Button
                            size="sm"
                            onClick={() => handleInsightAction(insight.id, 'view')}
                          >
                            Take Action
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4">{insight.description}</p>
                      
                      {insight.actionable && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(insight.id)}>
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleShareWithTeam(insight.id)}>
                            <Share className="w-4 h-4 mr-2" />
                            Share with Team
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AIAnalysis;