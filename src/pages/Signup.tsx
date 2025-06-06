import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, Phone, MapPin, Calendar, Shield,
  Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight,
  Building, CreditCard, Users, Stethoscope, Heart,
  Star, Award, Globe, Smartphone, Camera, Upload
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

interface SignupFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Account Security
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  
  // Professional Information (for providers)
  userType: 'patient' | 'provider' | 'admin';
  licenseNumber?: string;
  specialization?: string[];
  experience?: number;
  education?: string;
  certifications?: string[];
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Medical Information (for patients)
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
  
  // Business Information (for providers)
  clinicName?: string;
  clinicAddress?: string;
  businessLicense?: string;
  taxId?: string;
  
  // Preferences
  preferredLanguage: string;
  communicationPreferences: string[];
  marketingConsent: boolean;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    userType: 'patient',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Indonesia',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    preferredLanguage: 'Indonesian',
    communicationPreferences: [],
    marketingConsent: false,
    termsAccepted: false,
    privacyPolicyAccepted: false
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const specializations = [
    'Neurological Rehabilitation',
    'Orthopedic Therapy',
    'Pediatric Therapy',
    'Geriatric Therapy',
    'Sports Medicine',
    'Cardiac Rehabilitation',
    'Pulmonary Rehabilitation',
    'Hand Therapy',
    'Aquatic Therapy',
    'Pain Management',
    'Occupational Therapy',
    'Speech Therapy'
  ];

  const medicalConditions = [
    'Hypertension',
    'Diabetes',
    'Heart Disease',
    'Asthma',
    'Arthritis',
    'Osteoporosis',
    'Chronic Pain',
    'Depression',
    'Anxiety',
    'Stroke History',
    'Cancer History',
    'Kidney Disease'
  ];

  const allergies = [
    'Penicillin',
    'Aspirin',
    'Shellfish',
    'Nuts',
    'Latex',
    'Pollen',
    'Dust Mites',
    'Pet Dander',
    'Food Allergies',
    'Drug Allergies'
  ];

  const insuranceProviders = [
    'BPJS Kesehatan',
    'Prudential',
    'Allianz',
    'AXA Mandiri',
    'Cigna',
    'Great Eastern',
    'Sequis',
    'BNI Life',
    'Mandiri Inhealth',
    'Asuransi Jiwa Sraya',
    'Sinarmas MSIG Life',
    'Sun Life Financial'
  ];

  const communicationOptions = [
    'Email Notifications',
    'SMS Alerts',
    'Phone Calls',
    'Push Notifications',
    'WhatsApp Messages',
    'Appointment Reminders',
    'Health Tips',
    'Newsletter'
  ];

  const handleInputChange = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof SignupFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth && formData.gender);
      case 2:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.securityQuestion && formData.securityAnswer);
      case 3:
        if (formData.userType === 'provider') {
          return !!(formData.licenseNumber && formData.specialization && formData.specialization.length > 0 && formData.experience);
        }
        return true;
      case 4:
        return !!(formData.address && formData.city && formData.state && formData.zipCode && formData.emergencyContactName && formData.emergencyContactPhone);
      case 5:
        return formData.termsAccepted && formData.privacyPolicyAccepted;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        toast.success('✅ Step completed successfully!');
      }
    } else {
      toast.error('❌ Please fill in all required fields');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('❌ Please accept terms and privacy policy');
      return;
    }
    
    const userData = {
      email: formData.email,
      password: formData.password,
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.userType as 'provider' | 'patient',
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
      emergencyContact: formData.emergencyContactName ? {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelation
      } : undefined,
      medicalInfo: formData.userType === 'patient' ? {
        conditions: formData.medicalHistory || [],
        medications: formData.currentMedications || [],
        allergies: formData.allergies || []
      } : undefined,
      professionalInfo: formData.userType === 'provider' ? {
        license: formData.licenseNumber,
        specialization: formData.specialization || [],
        experience: formData.experience || 0,
        education: formData.education ? [formData.education] : []
      } : undefined,
      preferences: {
        theme: 'light' as 'light' | 'dark' | 'system',
        language: formData.preferredLanguage === 'Indonesian' ? 'id' as 'en' | 'id' : 'en' as 'en' | 'id',
        notifications: {
          email: formData.communicationPreferences.includes('Email Notifications'),
          sms: formData.communicationPreferences.includes('SMS Alerts'),
          push: formData.communicationPreferences.includes('Push Notifications')
        }
      }
    };
    
    const success = await register(userData);
    
    if (success) {
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    
    if (score < 40) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 70) return { score, label: 'Medium', color: 'bg-black' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            placeholder="+62 812 3456 7890"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType">Account Type *</Label>
        <Select value={formData.userType} onValueChange={(value: 'patient' | 'provider' | 'admin') => handleInputChange('userType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Patient - Seeking rehabilitation services</span>
              </div>
            </SelectItem>
            <SelectItem value="provider">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <span>Healthcare Provider - Offering services</span>
              </div>
            </SelectItem>
            <SelectItem value="admin">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Administrator - Managing platform</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Account Security</h2>
        <p className="text-gray-600 mt-2">Create a secure password and security question</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Password Strength:</span>
              <span className={`font-medium ${
                passwordStrength.label === 'Weak' ? 'text-red-600' :
                passwordStrength.label === 'Medium' ? 'text-black' : 'text-green-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <Progress value={passwordStrength.score} className="h-2" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {formData.confirmPassword && (
          <div className="flex items-center space-x-2 text-sm">
            {formData.password === formData.confirmPassword ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Passwords match</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-600">Passwords don't match</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityQuestion">Security Question *</Label>
        <Select value={formData.securityQuestion} onValueChange={(value) => handleInputChange('securityQuestion', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a security question" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pet">What was the name of your first pet?</SelectItem>
            <SelectItem value="school">What was the name of your elementary school?</SelectItem>
            <SelectItem value="city">In what city were you born?</SelectItem>
            <SelectItem value="mother">What is your mother's maiden name?</SelectItem>
            <SelectItem value="car">What was the make of your first car?</SelectItem>
            <SelectItem value="street">What street did you grow up on?</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityAnswer">Security Answer *</Label>
        <Input
          id="securityAnswer"
          placeholder="Enter your answer"
          value={formData.securityAnswer}
          onChange={(e) => handleInputChange('securityAnswer', e.target.value)}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Security Tips</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Use at least 8 characters with mix of letters, numbers, and symbols</li>
              <li>• Don't use personal information in your password</li>
              <li>• Choose a security question only you would know the answer to</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {formData.userType === 'provider' ? 'Professional Information' : 
           formData.userType === 'patient' ? 'Medical Information' : 'Additional Information'}
        </h2>
        <p className="text-gray-600 mt-2">
          {formData.userType === 'provider' ? 'Tell us about your professional background' :
           formData.userType === 'patient' ? 'Help us understand your medical needs' :
           'Additional details for your account'}
        </p>
      </div>

      {formData.userType === 'provider' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number *</Label>
            <div className="relative">
              <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="licenseNumber"
                placeholder="Enter your professional license number"
                value={formData.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Specializations *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {specializations.map((spec) => (
                <div key={spec} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec}
                    checked={(formData.specialization || []).includes(spec)}
                    onCheckedChange={(checked) => handleArrayChange('specialization', spec, checked as boolean)}
                  />
                  <Label htmlFor={spec} className="text-sm">{spec}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Input
                id="experience"
                type="number"
                placeholder="0"
                value={formData.experience || ''}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education">Highest Education</Label>
              <Input
                id="education"
                placeholder="e.g., Doctor of Physical Therapy"
                value={formData.education || ''}
                onChange={(e) => handleInputChange('education', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic/Practice Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="clinicName"
                placeholder="Enter your clinic or practice name"
                value={formData.clinicName || ''}
                onChange={(e) => handleInputChange('clinicName', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </>
      )}

      {formData.userType === 'patient' && (
        <>
          <div className="space-y-2">
            <Label>Medical History</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
              {medicalConditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={(formData.medicalHistory || []).includes(condition)}
                    onCheckedChange={(checked) => handleArrayChange('medicalHistory', condition, checked as boolean)}
                  />
                  <Label htmlFor={condition} className="text-sm">{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {allergies.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={(formData.allergies || []).includes(allergy)}
                    onCheckedChange={(checked) => handleArrayChange('allergies', allergy, checked as boolean)}
                  />
                  <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Select value={formData.insuranceProvider || ''} onValueChange={(value) => handleInputChange('insuranceProvider', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insuranceNumber">Insurance Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="insuranceNumber"
                  placeholder="Enter insurance number"
                  value={formData.insuranceNumber || ''}
                  onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">Preferred Language</Label>
        <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select preferred language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Indonesian">Indonesian</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Mandarin">Mandarin</SelectItem>
            <SelectItem value="Arabic">Arabic</SelectItem>
            <SelectItem value="Javanese">Javanese</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Address & Emergency Contact</h2>
        <p className="text-gray-600 mt-2">We need your address and emergency contact information</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Information
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Textarea
            id="address"
            placeholder="Enter your full address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State/Province *</Label>
            <Input
              id="state"
              placeholder="Enter state or province"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
            <Input
              id="zipCode"
              placeholder="Enter ZIP or postal code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indonesia">Indonesia</SelectItem>
                <SelectItem value="Malaysia">Malaysia</SelectItem>
                <SelectItem value="Singapore">Singapore</SelectItem>
                <SelectItem value="Thailand">Thailand</SelectItem>
                <SelectItem value="Philippines">Philippines</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Emergency Contact
        </h3>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
          <Input
            id="emergencyContactName"
            placeholder="Enter emergency contact name"
            value={formData.emergencyContactName}
            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="emergencyContactPhone"
                placeholder="+62 812 3456 7890"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emergencyContactRelation">Relationship</Label>
            <Select value={formData.emergencyContactRelation} onValueChange={(value) => handleInputChange('emergencyContactRelation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Preferences & Terms</h2>
        <p className="text-gray-600 mt-2">Final step - set your preferences and accept our terms</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          Communication Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {communicationOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={(formData.communicationPreferences || []).includes(option)}
                onCheckedChange={(checked) => handleArrayChange('communicationPreferences', option, checked as boolean)}
              />
              <Label htmlFor={option} className="text-sm">{option}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Marketing & Legal</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketingConsent"
              checked={formData.marketingConsent}
              onCheckedChange={(checked) => handleInputChange('marketingConsent', checked)}
            />
            <Label htmlFor="marketingConsent" className="text-sm leading-relaxed">
              I agree to receive marketing communications, promotional offers, and health tips via email and SMS. You can unsubscribe at any time.
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
            />
            <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
              I have read and agree to the{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              {' '}*
            </Label>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacyPolicyAccepted"
              checked={formData.privacyPolicyAccepted}
              onCheckedChange={(checked) => handleInputChange('privacyPolicyAccepted', checked)}
            />
            <Label htmlFor="privacyPolicyAccepted" className="text-sm leading-relaxed">
              I have read and agree to the{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              {' '}*
            </Label>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Almost Done!</h4>
            <p className="text-sm text-green-700 mt-1">
              You're about to create your Kinetic AI account. After registration, you'll receive a verification email to activate your account.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-black">
            Join Kinetic AI
          </h1>
          <p className="text-gray-600 mt-2">
            Create your account to access comprehensive rehabilitation services
          </p>
        </motion.div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl">Step {currentStep} of {totalSteps}</CardTitle>
              <Badge variant="outline">{Math.round(progressPercentage)}% Complete</Badge>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <span>Previous</span>
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(5) || isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Create Account</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;