import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet,
  PieChart, BarChart3, LineChart, Calculator, Receipt,
  Calendar, Filter, Download, RefreshCw, AlertTriangle,
  CheckCircle, Clock, ArrowUpRight, ArrowDownRight,
  Building, Users, Activity, Target, Award, Star,
  FileText, Eye, Edit, Trash2, Plus, Search,
  Banknote, Coins, Landmark
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'refund' | 'investment';
  category: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: string;
  reference: string;
  patientId?: string;
  patientName?: string;
  therapistId?: string;
  therapistName?: string;
  sessionId?: string;
  invoiceNumber?: string;
  taxAmount?: number;
  discountAmount?: number;
  netAmount: number;
  currency: string;
  exchangeRate?: number;
  location: string;
  notes?: string;
}

interface Revenue {
  period: string;
  totalRevenue: number;
  sessionsRevenue: number;
  equipmentRevenue: number;
  consultationRevenue: number;
  insuranceRevenue: number;
  privatePayRevenue: number;
  growthRate: number;
  targetRevenue: number;
  achievementRate: number;
}

interface Expense {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  vendor: string;
  approvedBy: string;
  department: string;
  budgetCategory: string;
  isRecurring: boolean;
  nextDueDate?: string;
  attachments: string[];
  status: 'approved' | 'pending' | 'rejected';
}

interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  workingCapital: number;
  roi: number;
  ebitda: number;
  burnRate: number;
  runway: number;
}

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Generate realistic financial data worth tens of millions
  const generateTransactions = (count: number): Transaction[] => {
    const categories = {
      income: ['Session Fees', 'Consultation Fees', 'Equipment Rental', 'Insurance Claims', 'Package Sales', 'Membership Fees'],
      expense: ['Staff Salaries', 'Equipment Purchase', 'Facility Rent', 'Utilities', 'Marketing', 'Insurance', 'Supplies', 'Maintenance'],
      refund: ['Session Refund', 'Package Refund', 'Insurance Refund'],
      investment: ['Equipment Investment', 'Facility Expansion', 'Technology Upgrade', 'Staff Training']
    };

    const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Insurance', 'Digital Wallet', 'Check'];
    const locations = ['Jakarta Main', 'Surabaya Branch', 'Bandung Branch', 'Medan Branch', 'Bali Branch'];
    const currencies = ['IDR', 'USD', 'SGD'];

    return Array.from({ length: count }, (_, i) => {
      const type = ['income', 'expense', 'refund', 'investment'][Math.floor(Math.random() * 4)] as 'income' | 'expense' | 'refund' | 'investment';
      const category = categories[type][Math.floor(Math.random() * categories[type].length)];
      const baseAmount = type === 'income' ? 
        Math.floor(Math.random() * 5000000) + 500000 : // 500K - 5.5M for income
        Math.floor(Math.random() * 3000000) + 100000;   // 100K - 3.1M for expenses
      
      const taxAmount = type === 'income' ? baseAmount * 0.1 : 0;
      const discountAmount = type === 'income' ? Math.floor(Math.random() * baseAmount * 0.1) : 0;
      const netAmount = baseAmount - taxAmount - discountAmount;
      
      return {
        id: `txn_${i + 1}`,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        type,
        category,
        description: `${category} - ${new Date().toLocaleDateString('id-ID')}`,
        amount: baseAmount,
        status: ['completed', 'pending', 'failed', 'cancelled'][Math.floor(Math.random() * 4)] as 'completed' | 'pending' | 'failed' | 'cancelled',
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        reference: `REF${Math.floor(Math.random() * 900000) + 100000}`,
        patientId: type === 'income' ? `patient_${Math.floor(Math.random() * 1000) + 1}` : undefined,
        patientName: type === 'income' ? `Patient ${Math.floor(Math.random() * 1000) + 1}` : undefined,
        therapistId: type === 'income' ? `therapist_${Math.floor(Math.random() * 50) + 1}` : undefined,
        therapistName: type === 'income' ? `Dr. Therapist ${Math.floor(Math.random() * 50) + 1}` : undefined,
        sessionId: type === 'income' ? `session_${Math.floor(Math.random() * 10000) + 1}` : undefined,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        taxAmount,
        discountAmount,
        netAmount,
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        exchangeRate: Math.random() * 0.1 + 0.95,
        location: locations[Math.floor(Math.random() * locations.length)],
        notes: Math.random() > 0.7 ? 'Additional notes for this transaction' : undefined
      };
    });
  };

  const generateRevenue = (): Revenue[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, i) => {
      const totalRevenue = Math.floor(Math.random() * 2000000000) + 1000000000; // 1-3 billion per month
      const sessionsRevenue = totalRevenue * 0.6;
      const equipmentRevenue = totalRevenue * 0.15;
      const consultationRevenue = totalRevenue * 0.15;
      const insuranceRevenue = totalRevenue * 0.7;
      const privatePayRevenue = totalRevenue * 0.3;
      const targetRevenue = totalRevenue * 1.1;
      
      return {
        period: `${month} 2024`,
        totalRevenue,
        sessionsRevenue,
        equipmentRevenue,
        consultationRevenue,
        insuranceRevenue,
        privatePayRevenue,
        growthRate: Math.random() * 20 - 5, // -5% to 15% growth
        targetRevenue,
        achievementRate: (totalRevenue / targetRevenue) * 100
      };
    });
  };

  const generateExpenses = (count: number): Expense[] => {
    const categories = {
      'Human Resources': ['Salaries', 'Benefits', 'Training', 'Recruitment'],
      'Operations': ['Rent', 'Utilities', 'Maintenance', 'Cleaning'],
      'Equipment': ['Purchase', 'Lease', 'Maintenance', 'Upgrade'],
      'Marketing': ['Digital Ads', 'Print Media', 'Events', 'Sponsorship'],
      'Technology': ['Software Licenses', 'Hardware', 'Cloud Services', 'Support'],
      'Administration': ['Legal', 'Accounting', 'Insurance', 'Office Supplies']
    };

    const vendors = [
      'PT Teknologi Medis Indonesia', 'CV Peralatan Kesehatan', 'PT Solusi Digital',
      'PT Konstruksi Bangunan', 'CV Marketing Kreatif', 'PT Konsultan Hukum',
      'PT Asuransi Kesehatan', 'CV Supplier Medis', 'PT Jasa Maintenance'
    ];

    const departments = ['Therapy', 'Administration', 'IT', 'HR', 'Finance', 'Marketing'];
    const approvers = ['Dr. Sarah Johnson', 'Mr. Michael Chen', 'Ms. Lisa Wong', 'Dr. David Kim'];

    return Array.from({ length: count }, (_, i) => {
      const category = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
      const subcategory = categories[category as keyof typeof categories][Math.floor(Math.random() * categories[category as keyof typeof categories].length)];
      
      return {
        id: `exp_${i + 1}`,
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        category,
        subcategory,
        description: `${subcategory} - ${category}`,
        amount: Math.floor(Math.random() * 500000000) + 10000000, // 10M - 510M
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        approvedBy: approvers[Math.floor(Math.random() * approvers.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        budgetCategory: category,
        isRecurring: Math.random() > 0.7,
        nextDueDate: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        attachments: [`invoice_${i + 1}.pdf`, `receipt_${i + 1}.jpg`],
        status: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)] as 'approved' | 'pending' | 'rejected'
      };
    });
  };

  // Generate data
  const [transactions] = useState(() => generateTransactions(50000)); // 50K transactions
  const [revenueData] = useState(() => generateRevenue());
  const [expenses] = useState(() => generateExpenses(10000)); // 10K expenses

  // Calculate financial metrics
  const calculateMetrics = (): FinancialMetrics => {
    const completedTransactions = transactions.filter(t => t.status === 'completed');
    const totalRevenue = completedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.netAmount, 0);
    
    const totalExpenses = expenses
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    
    const accountsReceivable = transactions
      .filter(t => t.type === 'income' && t.status === 'pending')
      .reduce((sum, t) => sum + t.netAmount, 0);
    
    const accountsPayable = expenses
      .filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const workingCapital = accountsReceivable - accountsPayable;
    const cashFlow = netProfit + accountsReceivable - accountsPayable;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      cashFlow,
      accountsReceivable,
      accountsPayable,
      workingCapital,
      roi: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      ebitda: netProfit * 1.2, // Simplified calculation
      burnRate: totalExpenses / 12, // Monthly burn rate
      runway: cashFlow > 0 ? (cashFlow / (totalExpenses / 12)) : 0 // Months of runway
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (amount: number, currency: string = 'IDR') => {
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const searchMatch = Object.values(transaction).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const categoryMatch = filterCategory === 'all' || transaction.type === filterCategory;
      return searchMatch && categoryMatch;
    });
  };

  const getPaginatedTransactions = () => {
    const filtered = getFilteredTransactions();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredTransactions().length / itemsPerPage);

  const handleExport = () => {
    toast.success('📊 Financial report export started!', {
      description: 'Your comprehensive financial report will be ready shortly',
      duration: 3000
    });
  };

  const handleViewTransaction = (transactionId: string) => {
    toast.success('👁️ Viewing transaction details', {
      description: `Opening details for transaction ${transactionId}`,
      duration: 2000
    });
  };

  const handleEditTransaction = (transactionId: string) => {
    toast.success('✏️ Edit transaction', {
      description: `Opening edit form for transaction ${transactionId}`,
      duration: 2000
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-200 mr-1" />
                  <span className="text-green-200 text-sm">+12.5% from last month</span>
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalExpenses)}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-200 mr-1" />
                  <span className="text-red-200 text-sm">-3.2% from last month</span>
                </div>
              </div>
              <CreditCard className="w-12 h-12 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Net Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.netProfit)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-blue-200 mr-1" />
                  <span className="text-blue-200 text-sm">{metrics.profitMargin.toFixed(1)}% margin</span>
                </div>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Cash Flow</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.cashFlow)}</p>
                <div className="flex items-center mt-2">
                  <Activity className="w-4 h-4 text-purple-200 mr-1" />
                  <span className="text-purple-200 text-sm">{metrics.runway.toFixed(0)} months runway</span>
                </div>
              </div>
              <Wallet className="w-12 h-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Accounts Receivable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {formatCurrency(metrics.accountsReceivable)}
            </div>
            <p className="text-gray-600 mt-2">Pending payments from clients</p>
            <Progress value={75} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Accounts Payable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(metrics.accountsPayable)}
            </div>
            <p className="text-gray-600 mt-2">Outstanding payments to vendors</p>
            <Progress value={45} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics.roi.toFixed(1)}%
            </div>
            <p className="text-gray-600 mt-2">Return on Investment</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 text-sm">Above industry average</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue performance over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-8"
                  style={{ height: `${(data.totalRevenue / Math.max(...revenueData.map(d => d.totalRevenue))) * 200}px` }}
                />
                <span className="text-xs text-gray-600 transform -rotate-45">{data.period}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({formatNumber(getFilteredTransactions().length)})</CardTitle>
          <CardDescription>
            Total value: {formatCurrency(getFilteredTransactions().reduce((sum, t) => sum + t.netAmount, 0))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Payment Method</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedTransactions().map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          transaction.type === 'income' ? 'default' :
                          transaction.type === 'expense' ? 'destructive' :
                          transaction.type === 'refund' ? 'secondary' : 'outline'
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.netAmount, transaction.currency)}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' :
                          transaction.status === 'failed' ? 'destructive' : 'outline'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4">{transaction.paymentMethod}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewTransaction(transaction.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditTransaction(transaction.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, getFilteredTransactions().length)} of {formatNumber(getFilteredTransactions().length)} transactions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Profit & Loss Statement</h3>
            <p className="text-gray-600 text-sm mb-4">Comprehensive P&L report for the selected period</p>
            <Button className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h3 className="font-semibold mb-2">Cash Flow Statement</h3>
            <p className="text-gray-600 text-sm mb-4">Detailed cash flow analysis and projections</p>
            <Button className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <PieChart className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h3 className="font-semibold mb-2">Revenue Analysis</h3>
            <p className="text-gray-600 text-sm mb-4">Revenue breakdown by service and location</p>
            <Button className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 mx-auto text-orange-600 mb-4" />
            <h3 className="font-semibold mb-2">Growth Analysis</h3>
            <p className="text-gray-600 text-sm mb-4">Year-over-year growth trends and forecasts</p>
            <Button className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calculator className="w-12 h-12 mx-auto text-red-600 mb-4" />
            <h3 className="font-semibold mb-2">Tax Report</h3>
            <p className="text-gray-600 text-sm mb-4">Tax calculations and compliance reports</p>
            <Button className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Building className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
            <h3 className="font-semibold mb-2">Department Analysis</h3>
            <p className="text-gray-600 text-sm mb-4">Financial performance by department</p>
            <Button className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Total Portfolio Value: {formatCurrency(metrics.totalRevenue + metrics.accountsReceivable)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="transactions">
              {renderTransactions()}
            </TabsContent>

            <TabsContent value="reports">
              {renderReports()}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialDashboard;