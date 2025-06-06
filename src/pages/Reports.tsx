import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Share,
  Calendar,
  Filter,
  Search,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  RefreshCw,
  Mail,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Report {
  id: string;
  title: string;
  type: 'patient-progress' | 'clinic-overview' | 'financial' | 'compliance' | 'ai-insights';
  description: string;
  generatedDate: string;
  period: string;
  status: 'ready' | 'generating' | 'scheduled';
  size: string;
  downloadUrl?: string;
  recipients?: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  isActive: boolean;
  lastGenerated?: string;
}

interface AnalyticsData {
  metric: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Monthly Patient Progress Summary',
    type: 'patient-progress',
    description: 'Comprehensive overview of all patient progress for January 2024',
    generatedDate: '2024-01-15',
    period: 'January 2024',
    status: 'ready',
    size: '2.4 MB',
    downloadUrl: '/reports/patient-progress-jan-2024.pdf',
    recipients: ['dr.johnson@clinic.com', 'admin@clinic.com']
  },
  {
    id: '2',
    title: 'Weekly Clinic Performance',
    type: 'clinic-overview',
    description: 'Key performance indicators and operational metrics',
    generatedDate: '2024-01-14',
    period: 'Week of Jan 8-14, 2024',
    status: 'ready',
    size: '1.8 MB',
    downloadUrl: '/reports/clinic-performance-week-2.pdf'
  },
  {
    id: '3',
    title: 'AI Analysis Insights Report',
    type: 'ai-insights',
    description: 'Machine learning insights and movement analysis trends',
    generatedDate: '2024-01-13',
    period: 'December 2023',
    status: 'ready',
    size: '3.1 MB',
    downloadUrl: '/reports/ai-insights-dec-2023.pdf'
  },
  {
    id: '4',
    title: 'Patient Compliance Analysis',
    type: 'compliance',
    description: 'Exercise adherence and appointment attendance rates',
    generatedDate: '2024-01-15',
    period: 'Q4 2023',
    status: 'generating',
    size: 'Calculating...',
  },
  {
    id: '5',
    title: 'Financial Summary Report',
    type: 'financial',
    description: 'Revenue, billing, and financial performance metrics',
    generatedDate: '2024-01-16',
    period: 'January 2024',
    status: 'scheduled',
    size: 'Pending'
  }
];

const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Daily Operations Summary',
    description: 'Daily overview of appointments, patient visits, and key metrics',
    type: 'Operations',
    frequency: 'daily',
    isActive: true,
    lastGenerated: '2024-01-15'
  },
  {
    id: '2',
    name: 'Weekly Patient Progress',
    description: 'Weekly compilation of patient progress and treatment outcomes',
    type: 'Clinical',
    frequency: 'weekly',
    isActive: true,
    lastGenerated: '2024-01-14'
  },
  {
    id: '3',
    name: 'Monthly Financial Report',
    description: 'Comprehensive financial analysis and revenue tracking',
    type: 'Financial',
    frequency: 'monthly',
    isActive: false,
    lastGenerated: '2023-12-31'
  },
  {
    id: '4',
    name: 'Quarterly AI Insights',
    description: 'Quarterly analysis of AI-driven insights and trends',
    type: 'Analytics',
    frequency: 'quarterly',
    isActive: true,
    lastGenerated: '2023-12-31'
  }
];

const mockAnalytics: AnalyticsData[] = [
  {
    metric: 'Total Patients',
    value: 247,
    unit: 'patients',
    change: 12.5,
    trend: 'up',
    period: 'vs last month'
  },
  {
    metric: 'Average Progress',
    value: 78.3,
    unit: '%',
    change: 5.2,
    trend: 'up',
    period: 'vs last month'
  },
  {
    metric: 'Compliance Rate',
    value: 85.7,
    unit: '%',
    change: -2.1,
    trend: 'down',
    period: 'vs last month'
  },
  {
    metric: 'Session Completion',
    value: 92.4,
    unit: '%',
    change: 1.8,
    trend: 'up',
    period: 'vs last month'
  },
  {
    metric: 'AI Accuracy',
    value: 94.2,
    unit: '%',
    change: 0.5,
    trend: 'stable',
    period: 'vs last month'
  },
  {
    metric: 'Patient Satisfaction',
    value: 4.6,
    unit: '/5',
    change: 0.2,
    trend: 'up',
    period: 'vs last month'
  }
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>(mockAnalytics);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('reports');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Handler functions for button actions
  const handleViewReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    alert(`📄 Viewing report: ${report?.title}`);
  };

  const handleDownloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    alert(`📥 Downloading report: ${report?.title}\nFile size: ${report?.size}`);
  };

  const handleShareEmail = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    alert(`📧 Sharing report via email: ${report?.title}`);
  };

  const handlePrintReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    alert(`🖨️ Printing report: ${report?.title}`);
  };

  const handleGenerateTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    alert(`⚡ Generating report from template: ${template?.name}`);
  };

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    alert(`✏️ Editing template: ${template?.name}`);
  };

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
    const template = templates.find(t => t.id === templateId);
    alert(`${template?.isActive ? '🔴 Deactivated' : '🟢 Activated'} template: ${template?.name}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clinic-overview':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'financial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ai-insights':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'generating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-3 h-3" />;
      case 'generating':
        return <RefreshCw className="w-3 h-3 animate-spin" />;
      case 'scheduled':
        return <Clock className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'bg-green-100 text-green-800';
      case 'weekly':
        return 'bg-blue-100 text-blue-800';
      case 'monthly':
        return 'bg-purple-100 text-purple-800';
      case 'quarterly':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const stats = {
    totalReports: reports.length,
    readyReports: reports.filter(r => r.status === 'ready').length,
    scheduledReports: reports.filter(r => r.status === 'scheduled').length,
    activeTemplates: templates.filter(t => t.isActive).length
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
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Generate, manage, and analyze comprehensive reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/70 backdrop-blur-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
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
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-green-600">{stats.readyReports}</p>
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
                <p className="text-2xl font-bold text-blue-600">{stats.scheduledReports}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeTemplates}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
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
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
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
                  <option value="patient-progress">Patient Progress</option>
                  <option value="clinic-overview">Clinic Overview</option>
                  <option value="financial">Financial</option>
                  <option value="compliance">Compliance</option>
                  <option value="ai-insights">AI Insights</option>
                </select>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                />
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <Badge className={`${getTypeColor(report.type)} border text-xs`}>
                              {report.type.replace('-', ' ')}
                            </Badge>
                            <Badge className={`${getStatusColor(report.status)} border text-xs`}>
                              {getStatusIcon(report.status)}
                              <span className="ml-1">{report.status}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{report.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Generated: {new Date(report.generatedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Period: {report.period}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Size: {report.size}</span>
                            </div>
                          </div>
                          {report.recipients && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Recipients: </span>
                              {report.recipients.join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {report.status === 'ready' && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleViewReport(report.id)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report.id)}>
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Share className="w-4 h-4 mr-1" />
                                    Share
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleShareEmail(report.id)}>
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handlePrintReport(report.id)}>
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                          {report.status === 'generating' && (
                            <Button size="sm" variant="outline" disabled>
                              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                              Generating...
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{metric.metric}</h3>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold text-gray-900">
                            {metric.value}
                          </span>
                          <span className="text-gray-600 text-sm mb-1">{metric.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`font-medium ${
                            metric.trend === 'up' ? 'text-green-600' : 
                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                          <span className="text-gray-500">{metric.period}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Patient Progress Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Progress trend chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Treatment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Treatment distribution chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            <div className="flex gap-2">
                              <Badge className={`${getFrequencyColor(template.frequency)} text-xs`}>
                                {template.frequency}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {template.type}
                              </Badge>
                              {template.isActive && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {template.lastGenerated && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Last Generated: </span>
                            {new Date(template.lastGenerated).toLocaleDateString()}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600" onClick={() => handleGenerateTemplate(template.id)}>
                            Generate Now
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template.id)}>
                            Edit Template
                          </Button>
                          <Button 
                            size="sm" 
                            variant={template.isActive ? "destructive" : "default"}
                            onClick={() => handleToggleTemplate(template.id)}
                          >
                            {template.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
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

export default Reports;