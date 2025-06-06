import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Search, Filter, Download, Upload, Plus, Edit, Trash2, Eye,
  BarChart3, PieChart, TrendingUp, Users, Calendar, MapPin, Star,
  RefreshCw, Settings, AlertCircle, CheckCircle, Clock, DollarSign,
  FileText, Image, Video, Music, Archive, Zap, Globe, Smartphone,
  Activity, Heart, Brain, Stethoscope, Pill, Thermometer, Weight,
  Target, Award, BookOpen, MessageSquare, Phone, Mail, Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Interfaces untuk berbagai jenis data
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'recovered' | 'inactive';
  joinDate: string;
  lastVisit: string;
  totalSessions: number;
  progress: number;
  assignedTherapist: string;
  insurance: string;
  emergencyContact: string;
  address: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
  };
  treatmentPlan: {
    goals: string[];
    exercises: string[];
    duration: number;
    frequency: string;
  };
  billingInfo: {
    totalCost: number;
    paidAmount: number;
    pendingAmount: number;
    insuranceCoverage: number;
  };
}

interface Equipment {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'diagnostic';
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  cost: number;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  usageHours: number;
  maxCapacity: number;
  currentUsers: number;
  specifications: {
    dimensions: string;
    weight: number;
    powerRequirement: string;
    features: string[];
  };
  maintenanceHistory: {
    date: string;
    type: string;
    cost: number;
    technician: string;
    notes: string;
  }[];
}

interface Session {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  date: string;
  duration: number;
  type: 'individual' | 'group' | 'virtual' | 'assessment';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  exercises: string[];
  equipmentUsed: string[];
  notes: string;
  painLevel: number;
  satisfactionRating: number;
  goals: string[];
  achievements: string[];
  nextSession: string;
  cost: number;
  insuranceCovered: boolean;
  vitalSigns: {
    beforeSession: {
      bloodPressure: string;
      heartRate: number;
      painLevel: number;
    };
    afterSession: {
      bloodPressure: string;
      heartRate: number;
      painLevel: number;
    };
  };
}

interface Therapist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  education: string[];
  certifications: string[];
  languages: string[];
  status: 'active' | 'on-leave' | 'inactive';
  joinDate: string;
  salary: number;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  currentPatients: number;
  maxPatients: number;
  rating: number;
  totalSessions: number;
  successRate: number;
  location: string;
  emergencyContact: string;
  performance: {
    patientSatisfaction: number;
    sessionCompletionRate: number;
    punctuality: number;
    professionalDevelopment: number;
  };
}

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Generate massive realistic data
  const generatePatients = (count: number): Patient[] => {
    const conditions = [
      'Stroke Recovery', 'Spinal Cord Injury', 'Traumatic Brain Injury', 'Parkinson\'s Disease',
      'Multiple Sclerosis', 'Cerebral Palsy', 'Arthritis', 'Fracture Recovery',
      'Post-Surgery Rehabilitation', 'Chronic Pain', 'Sports Injury', 'Back Pain',
      'Knee Replacement', 'Hip Replacement', 'Shoulder Injury', 'Cardiac Rehabilitation'
    ];
    
    const firstNames = [
      'Ahmad', 'Siti', 'Budi', 'Rina', 'Joko', 'Dewi', 'Andi', 'Maya', 'Rudi', 'Lina',
      'Hadi', 'Sari', 'Doni', 'Fitri', 'Agus', 'Wati', 'Eko', 'Indira', 'Bayu', 'Kartika'
    ];
    
    const lastNames = [
      'Pratama', 'Sari', 'Wijaya', 'Kusuma', 'Santoso', 'Permata', 'Cahaya',
      'Indah', 'Jaya', 'Mulia', 'Utama', 'Sejati', 'Bahagia', 'Sukses'
    ];

    const therapists = [
      'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Lisa Wong', 'Dr. David Kim',
      'Dr. Maria Garcia', 'Dr. James Wilson', 'Dr. Anna Petrov', 'Dr. Robert Taylor'
    ];

    const insuranceProviders = [
      'BPJS Kesehatan', 'Prudential', 'Allianz', 'AXA Mandiri', 'Cigna',
      'Great Eastern', 'Sequis', 'BNI Life', 'Mandiri Inhealth', 'Asuransi Jiwa Sraya'
    ];

    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const age = Math.floor(Math.random() * 60) + 20;
      const progress = Math.floor(Math.random() * 100);
      const totalSessions = Math.floor(Math.random() * 50) + 1;
      
      return {
        id: `patient_${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `+62${Math.floor(Math.random() * 900000000) + 100000000}`,
        age,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        condition,
        severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)] as 'mild' | 'moderate' | 'severe',
        status: ['active', 'recovered', 'inactive'][Math.floor(Math.random() * 3)] as 'active' | 'recovered' | 'inactive',
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalSessions,
        progress,
        assignedTherapist: therapists[Math.floor(Math.random() * therapists.length)],
        insurance: insuranceProviders[Math.floor(Math.random() * insuranceProviders.length)],
        emergencyContact: `+62${Math.floor(Math.random() * 900000000) + 100000000}`,
        address: `Jl. ${['Sudirman', 'Thamrin', 'Gatot Subroto', 'Kuningan', 'Senayan'][Math.floor(Math.random() * 5)]} No. ${Math.floor(Math.random() * 100) + 1}, Jakarta`,
        medicalHistory: ['Hypertension', 'Diabetes', 'Heart Disease'].slice(0, Math.floor(Math.random() * 3)),
        currentMedications: ['Aspirin', 'Metformin', 'Lisinopril'].slice(0, Math.floor(Math.random() * 3)),
        allergies: ['Penicillin', 'Shellfish', 'Nuts'].slice(0, Math.floor(Math.random() * 3)),
        vitalSigns: {
          bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 30) + 70}`,
          heartRate: Math.floor(Math.random() * 40) + 60,
          temperature: Math.round((Math.random() * 2 + 36) * 10) / 10,
          weight: Math.floor(Math.random() * 50) + 50,
          height: Math.floor(Math.random() * 30) + 150
        },
        treatmentPlan: {
          goals: ['Improve mobility', 'Reduce pain', 'Increase strength'].slice(0, Math.floor(Math.random() * 3) + 1),
          exercises: ['Walking', 'Stretching', 'Strength training'].slice(0, Math.floor(Math.random() * 3) + 1),
          duration: Math.floor(Math.random() * 12) + 4,
          frequency: ['Daily', '3x/week', '2x/week'][Math.floor(Math.random() * 3)]
        },
        billingInfo: {
          totalCost: Math.floor(Math.random() * 50000000) + 5000000,
          paidAmount: Math.floor(Math.random() * 30000000) + 2000000,
          pendingAmount: Math.floor(Math.random() * 20000000),
          insuranceCoverage: Math.floor(Math.random() * 80) + 20
        }
      };
    });
  };

  const generateEquipment = (count: number): Equipment[] => {
    const equipmentTypes = [
      { name: 'Treadmill Pro X1', type: 'cardio', brand: 'TechnoGym' },
      { name: 'Leg Press Machine', type: 'strength', brand: 'Cybex' },
      { name: 'Balance Trainer', type: 'balance', brand: 'BOSU' },
      { name: 'Ultrasound Therapy Unit', type: 'diagnostic', brand: 'Chattanooga' },
      { name: 'Resistance Bands Set', type: 'flexibility', brand: 'TheraBand' },
      { name: 'Elliptical Trainer', type: 'cardio', brand: 'Life Fitness' },
      { name: 'Cable Machine', type: 'strength', brand: 'HUR' },
      { name: 'Parallel Bars', type: 'balance', brand: 'Bailey' },
      { name: 'TENS Unit', type: 'diagnostic', brand: 'Compex' },
      { name: 'Yoga Mats', type: 'flexibility', brand: 'Manduka' }
    ];

    const locations = [
      'Therapy Room 1', 'Therapy Room 2', 'Gym Area', 'Cardio Zone',
      'Strength Training Area', 'Balance Training Room', 'Assessment Room',
      'Hydrotherapy Pool', 'Group Exercise Room', 'Storage Room'
    ];

    return Array.from({ length: count }, (_, i) => {
      const equipment = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
      const purchaseDate = new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000);
      const lastMaintenance = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
      
      return {
        id: `equipment_${i + 1}`,
        name: equipment.name,
        type: equipment.type as 'cardio' | 'strength' | 'flexibility' | 'balance' | 'diagnostic',
        brand: equipment.brand,
        model: `Model ${Math.floor(Math.random() * 9000) + 1000}`,
        serialNumber: `SN${Math.floor(Math.random() * 900000) + 100000}`,
        purchaseDate: purchaseDate.toISOString(),
        cost: Math.floor(Math.random() * 500000000) + 10000000,
        status: ['available', 'in-use', 'maintenance', 'retired'][Math.floor(Math.random() * 4)] as 'available' | 'in-use' | 'maintenance' | 'retired',
        location: locations[Math.floor(Math.random() * locations.length)],
        lastMaintenance: lastMaintenance.toISOString(),
        nextMaintenance: new Date(lastMaintenance.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        usageHours: Math.floor(Math.random() * 5000),
        maxCapacity: Math.floor(Math.random() * 10) + 1,
        currentUsers: Math.floor(Math.random() * 5),
        specifications: {
          dimensions: `${Math.floor(Math.random() * 200) + 100}x${Math.floor(Math.random() * 100) + 50}x${Math.floor(Math.random() * 150) + 100} cm`,
          weight: Math.floor(Math.random() * 500) + 50,
          powerRequirement: `${Math.floor(Math.random() * 2000) + 500}W`,
          features: ['Digital Display', 'Heart Rate Monitor', 'Safety Features'].slice(0, Math.floor(Math.random() * 3) + 1)
        },
        maintenanceHistory: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          type: ['Routine', 'Repair', 'Upgrade'][Math.floor(Math.random() * 3)],
          cost: Math.floor(Math.random() * 5000000) + 500000,
          technician: `Technician ${j + 1}`,
          notes: 'Maintenance completed successfully'
        }))
      };
    });
  };

  const generateSessions = (count: number): Session[] => {
    const exerciseTypes = [
      'Gait Training', 'Balance Exercises', 'Strength Training', 'Range of Motion',
      'Coordination Exercises', 'Endurance Training', 'Pain Management', 'Functional Training'
    ];

    const equipmentList = [
      'Treadmill', 'Parallel Bars', 'Exercise Bike', 'Resistance Bands',
      'Balance Board', 'Weights', 'Therapy Ball', 'TENS Unit'
    ];

    return Array.from({ length: count }, (_, i) => {
      const sessionDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
      
      return {
        id: `session_${i + 1}`,
        patientId: `patient_${Math.floor(Math.random() * 1000) + 1}`,
        patientName: `Patient ${Math.floor(Math.random() * 1000) + 1}`,
        therapistId: `therapist_${Math.floor(Math.random() * 20) + 1}`,
        therapistName: `Dr. Therapist ${Math.floor(Math.random() * 20) + 1}`,
        date: sessionDate.toISOString(),
        duration: Math.floor(Math.random() * 60) + 30,
        type: ['individual', 'group', 'virtual', 'assessment'][Math.floor(Math.random() * 4)] as 'individual' | 'group' | 'virtual' | 'assessment',
        status: ['scheduled', 'completed', 'cancelled', 'no-show'][Math.floor(Math.random() * 4)] as 'scheduled' | 'completed' | 'cancelled' | 'no-show',
        exercises: exerciseTypes.slice(0, Math.floor(Math.random() * 4) + 1),
        equipmentUsed: equipmentList.slice(0, Math.floor(Math.random() * 3) + 1),
        notes: 'Patient showed good progress during session',
        painLevel: Math.floor(Math.random() * 10) + 1,
        satisfactionRating: Math.floor(Math.random() * 5) + 1,
        goals: ['Improve mobility', 'Reduce pain', 'Increase strength'].slice(0, Math.floor(Math.random() * 3) + 1),
        achievements: ['Completed all exercises', 'Improved balance', 'Reduced pain level'].slice(0, Math.floor(Math.random() * 3)),
        nextSession: new Date(sessionDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        cost: Math.floor(Math.random() * 1000000) + 200000,
        insuranceCovered: Math.random() > 0.3,
        vitalSigns: {
          beforeSession: {
            bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 30) + 70}`,
            heartRate: Math.floor(Math.random() * 40) + 60,
            painLevel: Math.floor(Math.random() * 10) + 1
          },
          afterSession: {
            bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 30) + 70}`,
            heartRate: Math.floor(Math.random() * 40) + 60,
            painLevel: Math.floor(Math.random() * 8) + 1
          }
        }
      };
    });
  };

  const generateTherapists = (count: number): Therapist[] => {
    const specializations = [
      'Neurological Rehabilitation', 'Orthopedic Therapy', 'Pediatric Therapy',
      'Geriatric Therapy', 'Sports Medicine', 'Cardiac Rehabilitation',
      'Pulmonary Rehabilitation', 'Hand Therapy', 'Aquatic Therapy'
    ];

    const educations = [
      'Bachelor of Physical Therapy - University of Indonesia',
      'Master of Rehabilitation Science - Gadjah Mada University',
      'Doctor of Physical Therapy - Airlangga University',
      'Bachelor of Occupational Therapy - Padjadjaran University'
    ];

    const certifications = [
      'Certified Neurologic Physical Therapist',
      'Orthopedic Certified Specialist',
      'Pediatric Certified Specialist',
      'Sports Certified Specialist',
      'Geriatric Certified Specialist'
    ];

    const firstNames = [
      'Dr. Sarah', 'Dr. Michael', 'Dr. Lisa', 'Dr. David', 'Dr. Maria',
      'Dr. James', 'Dr. Anna', 'Dr. Robert', 'Dr. Emily', 'Dr. Daniel'
    ];

    const lastNames = [
      'Johnson', 'Chen', 'Wong', 'Kim', 'Garcia', 'Wilson', 'Petrov',
      'Taylor', 'Anderson', 'Martinez', 'Brown', 'Davis', 'Miller'
    ];

    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const experience = Math.floor(Math.random() * 20) + 1;
      
      return {
        id: `therapist_${i + 1}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase().replace('dr. ', '')}.${lastName.toLowerCase()}@kineticai.com`,
        phone: `+62${Math.floor(Math.random() * 900000000) + 100000000}`,
        specialization: specializations.slice(0, Math.floor(Math.random() * 3) + 1),
        experience,
        education: educations.slice(0, Math.floor(Math.random() * 2) + 1),
        certifications: certifications.slice(0, Math.floor(Math.random() * 3) + 1),
        languages: ['Indonesian', 'English', 'Mandarin'].slice(0, Math.floor(Math.random() * 3) + 1),
        status: ['active', 'on-leave', 'inactive'][Math.floor(Math.random() * 3)] as 'active' | 'on-leave' | 'inactive',
        joinDate: new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000).toISOString(),
        salary: Math.floor(Math.random() * 100000000) + 50000000,
        workingHours: {
          monday: '08:00-17:00',
          tuesday: '08:00-17:00',
          wednesday: '08:00-17:00',
          thursday: '08:00-17:00',
          friday: '08:00-17:00',
          saturday: '08:00-12:00',
          sunday: 'Off'
        },
        currentPatients: Math.floor(Math.random() * 30) + 5,
        maxPatients: Math.floor(Math.random() * 20) + 30,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        totalSessions: Math.floor(Math.random() * 1000) + 100,
        successRate: Math.round((Math.random() * 30 + 70) * 10) / 10,
        location: ['Jakarta', 'Surabaya', 'Bandung', 'Medan'][Math.floor(Math.random() * 4)],
        emergencyContact: `+62${Math.floor(Math.random() * 900000000) + 100000000}`,
        performance: {
          patientSatisfaction: Math.round((Math.random() * 2 + 3) * 10) / 10,
          sessionCompletionRate: Math.round((Math.random() * 20 + 80) * 10) / 10,
          punctuality: Math.round((Math.random() * 20 + 80) * 10) / 10,
          professionalDevelopment: Math.round((Math.random() * 2 + 3) * 10) / 10
        }
      };
    });
  };

  // Generate data
  const [patients] = useState(() => generatePatients(25000)); // 25,000 patients
  const [equipment] = useState(() => generateEquipment(5000)); // 5,000 equipment
  const [sessions] = useState(() => generateSessions(75000)); // 75,000 sessions
  const [therapists] = useState(() => generateTherapists(1000)); // 1,000 therapists

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'patients': return patients;
      case 'equipment': return equipment;
      case 'sessions': return sessions;
      case 'therapists': return therapists;
      default: return [];
    }
  };

  const getFilteredData = () => {
    const data = getCurrentData();
    return data.filter(item => {
      const searchMatch = Object.values(item).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const statusMatch = filterStatus === 'all' || 
        (item as any).status === filterStatus ||
        (activeTab === 'equipment' && filterStatus === 'available' && (item as Equipment).status === 'available');
      return searchMatch && statusMatch;
    });
  };

  const getSortedData = () => {
    const filtered = getFilteredData();
    return filtered.sort((a, b) => {
      const aValue = (a as any)[sortBy];
      const bValue = (b as any)[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const getPaginatedData = () => {
    const sorted = getSortedData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sorted.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(getFilteredData().length / itemsPerPage);

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.error('❌ No items selected');
      return;
    }

    toast.success(`✅ ${action} berhasil untuk ${selectedItems.length} item`);
    setSelectedItems([]);
  };

  const handleExport = () => {
    const data = getFilteredData();
    toast.success(`📊 Export ${formatNumber(data.length)} data dimulai!`, {
      description: 'File akan diunduh dalam beberapa detik',
      duration: 3000
    });
  };

  const getTotalValue = () => {
    switch (activeTab) {
      case 'patients':
        return patients.reduce((sum, p) => sum + p.billingInfo.totalCost, 0);
      case 'equipment':
        return equipment.reduce((sum, e) => sum + e.cost, 0);
      case 'sessions':
        return sessions.reduce((sum, s) => sum + s.cost, 0);
      case 'therapists':
        return therapists.reduce((sum, t) => sum + t.salary * 12, 0);
      default:
        return 0;
    }
  };

  const renderPatientRow = (patient: Patient) => (
    <tr key={patient.id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedItems.includes(patient.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, patient.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== patient.id));
            }
          }}
        />
      </td>
      <td className="p-4">
        <div>
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-gray-600">{patient.email}</p>
        </div>
      </td>
      <td className="p-4">{patient.age}</td>
      <td className="p-4">
        <Badge variant={patient.severity === 'severe' ? 'destructive' : patient.severity === 'moderate' ? 'default' : 'secondary'}>
          {patient.condition}
        </Badge>
      </td>
      <td className="p-4">
        <Badge variant={patient.status === 'active' ? 'default' : patient.status === 'recovered' ? 'secondary' : 'destructive'}>
          {patient.status}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Progress value={patient.progress} className="w-16 h-2" />
          <span className="text-sm">{patient.progress}%</span>
        </div>
      </td>
      <td className="p-4 font-medium text-green-600">
        {formatCurrency(patient.billingInfo.totalCost)}
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => setEditingItem(patient)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  const renderEquipmentRow = (item: Equipment) => (
    <tr key={item.id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, item.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== item.id));
            }
          }}
        />
      </td>
      <td className="p-4">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-600">{item.brand} - {item.model}</p>
        </div>
      </td>
      <td className="p-4">
        <Badge>{item.type}</Badge>
      </td>
      <td className="p-4">
        <Badge variant={item.status === 'available' ? 'default' : item.status === 'in-use' ? 'secondary' : 'destructive'}>
          {item.status}
        </Badge>
      </td>
      <td className="p-4">{item.location}</td>
      <td className="p-4">{formatNumber(item.usageHours)}h</td>
      <td className="p-4 font-medium text-green-600">
        {formatCurrency(item.cost)}
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  const renderSessionRow = (session: Session) => (
    <tr key={session.id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedItems.includes(session.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, session.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== session.id));
            }
          }}
        />
      </td>
      <td className="p-4">
        <div>
          <p className="font-medium">{session.patientName}</p>
          <p className="text-sm text-gray-600">{session.therapistName}</p>
        </div>
      </td>
      <td className="p-4">{new Date(session.date).toLocaleDateString('id-ID')}</td>
      <td className="p-4">{session.duration} min</td>
      <td className="p-4">
        <Badge>{session.type}</Badge>
      </td>
      <td className="p-4">
        <Badge variant={session.status === 'completed' ? 'default' : session.status === 'scheduled' ? 'secondary' : 'destructive'}>
          {session.status}
        </Badge>
      </td>
      <td className="p-4 font-medium text-green-600">
        {formatCurrency(session.cost)}
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => setEditingItem(session)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  const renderTherapistRow = (therapist: Therapist) => (
    <tr key={therapist.id} className="border-b hover:bg-gray-50">
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedItems.includes(therapist.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, therapist.id]);
            } else {
              setSelectedItems(selectedItems.filter(id => id !== therapist.id));
            }
          }}
        />
      </td>
      <td className="p-4">
        <div>
          <p className="font-medium">{therapist.name}</p>
          <p className="text-sm text-gray-600">{therapist.email}</p>
        </div>
      </td>
      <td className="p-4">{therapist.experience} years</td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {therapist.specialization.slice(0, 2).map((spec, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{spec}</Badge>
          ))}
        </div>
      </td>
      <td className="p-4">
        <Badge variant={therapist.status === 'active' ? 'default' : 'secondary'}>
          {therapist.status}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span>{therapist.rating}</span>
        </div>
      </td>
      <td className="p-4 font-medium text-green-600">
        {formatCurrency(therapist.salary)}
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => setEditingItem(therapist)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Data Management Center
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola {formatNumber(patients.length + equipment.length + sessions.length + therapists.length)} data bernilai {formatCurrency(getTotalValue())}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add New</span>
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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Patients</p>
                  <p className="text-3xl font-bold">{formatNumber(patients.length)}</p>
                  <p className="text-blue-200 text-sm">Active: {formatNumber(patients.filter(p => p.status === 'active').length)}</p>
                </div>
                <Users className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Equipment</p>
                  <p className="text-3xl font-bold">{formatNumber(equipment.length)}</p>
                  <p className="text-green-200 text-sm">Available: {formatNumber(equipment.filter(e => e.status === 'available').length)}</p>
                </div>
                <Database className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Sessions</p>
                  <p className="text-3xl font-bold">{formatNumber(sessions.length)}</p>
                  <p className="text-purple-200 text-sm">Completed: {formatNumber(sessions.filter(s => s.status === 'completed').length)}</p>
                </div>
                <Activity className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Therapists</p>
                  <p className="text-3xl font-bold">{formatNumber(therapists.length)}</p>
                  <p className="text-orange-200 text-sm">Active: {formatNumber(therapists.filter(t => t.status === 'active').length)}</p>
                </div>
                <Stethoscope className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="therapists">Therapists</TabsTrigger>
            </TabsList>

            {/* Search and Filter Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={`Cari ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        {activeTab === 'equipment' && <SelectItem value="available">Available</SelectItem>}
                        {activeTab === 'sessions' && <SelectItem value="completed">Completed</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {selectedItems.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('Delete')}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBulkAction('Export')}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Tables */}
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Patients ({formatNumber(getFilteredData().length)})</CardTitle>
                  <CardDescription>
                    Total value: {formatCurrency(patients.reduce((sum, p) => sum + p.billingInfo.totalCost, 0))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(getPaginatedData().map(item => item.id));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left p-4">Patient</th>
                          <th className="text-left p-4">Age</th>
                          <th className="text-left p-4">Condition</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Progress</th>
                          <th className="text-left p-4">Total Cost</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData().map((patient) => renderPatientRow(patient as Patient))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipment">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment ({formatNumber(getFilteredData().length)})</CardTitle>
                  <CardDescription>
                    Total value: {formatCurrency(equipment.reduce((sum, e) => sum + e.cost, 0))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(getPaginatedData().map(item => item.id));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left p-4">Equipment</th>
                          <th className="text-left p-4">Type</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Location</th>
                          <th className="text-left p-4">Usage</th>
                          <th className="text-left p-4">Cost</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData().map((item) => renderEquipmentRow(item as Equipment))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Sessions ({formatNumber(getFilteredData().length)})</CardTitle>
                  <CardDescription>
                    Total value: {formatCurrency(sessions.reduce((sum, s) => sum + s.cost, 0))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(getPaginatedData().map(item => item.id));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left p-4">Patient/Therapist</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Duration</th>
                          <th className="text-left p-4">Type</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Cost</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData().map((session) => renderSessionRow(session as Session))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="therapists">
              <Card>
                <CardHeader>
                  <CardTitle>Therapists ({formatNumber(getFilteredData().length)})</CardTitle>
                  <CardDescription>
                    Total annual salary: {formatCurrency(therapists.reduce((sum, t) => sum + t.salary * 12, 0))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(getPaginatedData().map(item => item.id));
                                } else {
                                  setSelectedItems([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left p-4">Therapist</th>
                          <th className="text-left p-4">Experience</th>
                          <th className="text-left p-4">Specialization</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Rating</th>
                          <th className="text-left p-4">Salary</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData().map((therapist) => renderTherapistRow(therapist as Therapist))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, getFilteredData().length)} of {formatNumber(getFilteredData().length)} entries
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
          </Tabs>
        </motion.div>

        {/* Add New Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1)}</DialogTitle>
              <DialogDescription>
                Add a new {activeTab.slice(0, -1)} to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {activeTab === 'patients' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Patient name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input type="number" className="w-full p-2 border rounded" placeholder="Age" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Condition</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Medical condition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full p-2 border rounded">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Full address" />
                  </div>
                </div>
              )}
              {activeTab === 'equipment' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Equipment name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Equipment type" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full p-2 border rounded">
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Location" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost</label>
                    <input type="number" className="w-full p-2 border rounded" placeholder="Cost" />
                  </div>
                </div>
              )}
              {activeTab === 'sessions' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient/Therapist</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Duration" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Session type" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full p-2 border rounded">
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cost</label>
                    <input type="number" className="w-full p-2 border rounded" placeholder="Cost" />
                  </div>
                </div>
              )}
              {activeTab === 'therapists' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Therapist name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Years of experience" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Specialization</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Specialization" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full p-2 border rounded">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Salary</label>
                    <input type="number" className="w-full p-2 border rounded" placeholder="Monthly salary" />
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Add logic to save new item here
                  alert(`New ${activeTab.slice(0, -1)} added successfully!`);
                  setShowAddDialog(false);
                }}>
                  Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Information</DialogTitle>
              <DialogDescription>
                Detailed view of selected item
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-6">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(editingItem, null, 2)}
                </pre>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DataManagement;