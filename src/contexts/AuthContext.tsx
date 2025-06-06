import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'provider' | 'patient';
  avatar?: string;
  department?: string;
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
  profile: {
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
    medicalInfo?: {
      conditions: string[];
      medications: string[];
      allergies: string[];
    };
    professionalInfo?: {
      license: string;
      specialization: string[];
      experience: number;
      education: string[];
    };
  };
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'id';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'contacts';
      dataSharing: boolean;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'provider' | 'patient';
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  professionalInfo?: {
    license: string;
    specialization: string[];
    experience: number;
    education: string[];
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'id';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API calls with realistic delays
  const simulateApiCall = (delay: number = 1000) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };

  // Generate demo users
  const generateDemoUsers = (): User[] => {
    return [
      {
        id: 'user_1',
        email: 'admin@kineticai.com',
        name: 'Dr. Sarah Johnson',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
        department: 'Administration',
        permissions: ['*'], // All permissions
        lastLogin: new Date().toISOString(),
        isActive: true,
        profile: {
          phone: '+62 812-3456-7890',
          address: 'Jakarta, Indonesia',
          dateOfBirth: '1985-03-15',
          professionalInfo: {
            license: 'MD-12345',
            specialization: ['Physical Therapy', 'Rehabilitation Medicine'],
            experience: 15,
            education: ['MD from University of Indonesia', 'PhD in Rehabilitation Medicine']
          }
        },
        settings: {
          theme: 'light',
          language: 'en',
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          privacy: {
            profileVisibility: 'public',
            dataSharing: true
          }
        }
      },
      {
        id: 'user_2',
        email: 'provider@kineticai.com',
        name: 'Dr. Michael Chen',
        role: 'provider',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
        department: 'Therapy',
        permissions: ['read_patients', 'write_patients', 'read_sessions', 'write_sessions'],
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        profile: {
          phone: '+62 813-4567-8901',
          address: 'Surabaya, Indonesia',
          dateOfBirth: '1988-07-22',
          professionalInfo: {
            license: 'PT-67890',
            specialization: ['Occupational Therapy', 'Sports Rehabilitation'],
            experience: 8,
            education: ['Bachelor in Physical Therapy', 'Master in Sports Medicine']
          }
        },
        settings: {
          theme: 'dark',
          language: 'id',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          privacy: {
            profileVisibility: 'contacts',
            dataSharing: false
          }
        }
      },
      {
        id: 'user_3',
        email: 'patient@kineticai.com',
        name: 'Lisa Wong',
        role: 'patient',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        permissions: ['read_own_data', 'write_own_data'],
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        profile: {
          phone: '+62 814-5678-9012',
          address: 'Bandung, Indonesia',
          dateOfBirth: '1992-11-08',
          emergencyContact: {
            name: 'John Wong',
            phone: '+62 815-6789-0123',
            relationship: 'Spouse'
          },
          medicalInfo: {
            conditions: ['Lower Back Pain', 'Muscle Strain'],
            medications: ['Ibuprofen 400mg', 'Muscle Relaxant'],
            allergies: ['Penicillin', 'Shellfish']
          }
        },
        settings: {
          theme: 'system',
          language: 'en',
          notifications: {
            email: true,
            sms: true,
            push: false
          },
          privacy: {
            profileVisibility: 'private',
            dataSharing: false
          }
        }
      }
    ];
  };

  const demoUsers = generateDemoUsers();

  useEffect(() => {
    // Check for existing session
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          // Simulate token validation
          await simulateApiCall(500);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await simulateApiCall(1500);
      
      // Accept any email and password - always use super admin for demo
      const foundUser = demoUsers.find(u => u.role === 'super_admin') || demoUsers[0];
      
      // Always allow login with any credentials for demo purposes
      
      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };
      
      setUser(updatedUser);
      
      // Store session data
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
      
      toast.success('Welcome back!', {
        description: `Logged in as ${updatedUser.name}`,
        duration: 3000
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed', {
        description: 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('remember_me');
    
    toast.success('Logged out successfully', {
      description: 'See you next time!'
    });
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await simulateApiCall(2000);
      
      // Check if email already exists
      const existingUser = demoUsers.find(u => u.email === userData.email);
      if (existingUser) {
        toast.error('Registration failed', {
          description: 'Email already exists'
        });
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        permissions: userData.role === 'provider' ? 
          ['read_patients', 'write_patients', 'read_sessions', 'write_sessions'] :
          ['read_own_data', 'write_own_data'],
        lastLogin: new Date().toISOString(),
        isActive: true,
        profile: {
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          emergencyContact: userData.emergencyContact,
          medicalInfo: userData.medicalInfo,
          professionalInfo: userData.professionalInfo
        },
        settings: userData.preferences
      };
      
      // In a real app, this would be saved to the database
      demoUsers.push(newUser);
      
      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account',
        duration: 5000
      });
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed', {
        description: 'An unexpected error occurred'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      setIsLoading(true);
      await simulateApiCall(1000);
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await simulateApiCall(1500);
      
      const foundUser = demoUsers.find(u => u.email === email);
      if (!foundUser) {
        toast.error('Email not found');
        return false;
      }
      
      toast.success('Password reset email sent', {
        description: 'Check your email for reset instructions'
      });
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error('Failed to send reset email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await simulateApiCall(1000);
      
      // In a real app, validate current password
      if (currentPassword !== 'password123') {
        toast.error('Current password is incorrect');
        return false;
      }
      
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error('Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await simulateApiCall(1000);
      
      toast.success('Email verified successfully');
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      toast.error('Failed to verify email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      await simulateApiCall(500);
      
      const newToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('auth_token', newToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
    resetPassword,
    changePassword,
    verifyEmail,
    refreshToken,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;