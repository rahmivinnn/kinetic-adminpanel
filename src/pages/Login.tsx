import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Eye, EyeOff, Lock, Mail, Shield, Smartphone,
  CheckCircle, AlertCircle, Loader2, ArrowRight,
  Building, Users, Activity, Star, Award, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'provider' | 'patient';
  organization?: string;
  acceptTerms: boolean;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'biometric'>('email');
  
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    organization: '',
    acceptTerms: false
  });

  // Demo users dengan data yang realistis
  const demoUsers = [
    {
      email: 'admin@kineticai.com',
      password: 'admin123',
      role: 'admin',
      name: 'Dr. Sarah Johnson',
      organization: 'Kinetic AI Medical Center'
    },
    {
      email: 'provider@kineticai.com',
      password: 'provider123',
      role: 'provider',
      name: 'Dr. Michael Chen',
      organization: 'Physical Therapy Associates'
    },
    {
      email: 'patient@kineticai.com',
      password: 'patient123',
      role: 'patient',
      name: 'Emma Wilson',
      organization: 'Patient'
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const success = await login(loginForm.email, loginForm.password, loginForm.rememberMe);
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi form
      if (signupForm.password !== signupForm.confirmPassword) {
        toast.error('❌ Password tidak cocok', {
          description: 'Pastikan password dan konfirmasi password sama',
          duration: 4000
        });
        return;
      }

      if (!signupForm.acceptTerms) {
        toast.error('❌ Syarat dan Ketentuan', {
          description: 'Anda harus menyetujui syarat dan ketentuan',
          duration: 4000
        });
        return;
      }

      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulasi pendaftaran berhasil
      const newUserId = Math.random().toString(36).substr(2, 9);
      
      toast.success('🎉 Pendaftaran Berhasil!', {
        description: `Akun ${signupForm.role} telah dibuat. Silakan login.`,
        duration: 4000
      });

      // Reset form dan switch ke tab login
      setSignupForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        organization: '',
        acceptTerms: false
      });
      setActiveTab('login');

    } catch (error) {
      toast.error('❌ Pendaftaran Gagal', {
        description: 'Silakan coba lagi dalam beberapa saat',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'provider' | 'patient') => {
    const user = demoUsers.find(u => u.role === userType);
    if (user) {
      setLoginForm({
        email: user.email,
        password: user.password,
        rememberMe: false
      });
      toast.info(`📝 Demo ${userType} credentials filled`, {
        description: `Email: ${user.email}`,
        duration: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left Side - Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  Kinetic AI
                </h1>
                <p className="text-gray-600">Super Duper Admin Panel</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-black">
                Manage Rehabilitation with
                <span className="block text-black">
                  Advanced Technology
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Complete rehabilitation management platform with data worth tens of millions of rupiah, 
                AI analysis, and real-time monitoring system for optimal therapy results.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-purple-600">50,000+</div>
                <div className="text-sm text-gray-600">Active Patients</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-blue-600">₹25M+</div>
                <div className="text-sm text-gray-600">Data Value</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-green-600">1,200+</div>
                <div className="text-sm text-gray-600">Therapists</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login/Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
              <CardDescription>
                Access your Kinetic AI dashboard or create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@kineticai.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={loginForm.rememberMe}
                        onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Login</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm text-gray-600 text-center">Demo Credentials:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoCredentials('admin')}
                        className="text-xs"
                      >
                        Admin
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoCredentials('provider')}
                        className="text-xs"
                      >
                        Provider
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fillDemoCredentials('patient')}
                        className="text-xs"
                      >
                        Patient
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Nama Depan</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nama Belakang</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={signupForm.lastName}
                          onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="john.doe@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={signupForm.role}
                        onChange={(e) => setSignupForm({...signupForm, role: e.target.value as 'admin' | 'provider' | 'patient'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="patient">Patient</option>
                        <option value="provider">Healthcare Provider</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    {(signupForm.role === 'admin' || signupForm.role === 'provider') && (
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organisasi</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="organization"
                            placeholder="Nama rumah sakit/klinik"
                            value={signupForm.organization}
                            onChange={(e) => setSignupForm({...signupForm, organization: e.target.value})}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={signupForm.acceptTerms}
                        onChange={(e) => setSignupForm({...signupForm, acceptTerms: e.target.checked})}
                        className="rounded border-gray-300"
                        required
                      />
                      <Label htmlFor="terms" className="text-sm">
                        Saya menyetujui <a href="#" className="text-purple-600 hover:underline">syarat dan ketentuan</a>
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Mendaftar...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Daftar Sekarang</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;