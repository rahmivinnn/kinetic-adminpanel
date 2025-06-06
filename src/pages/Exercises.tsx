import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  Star,
  Filter,
  Search,
  Plus,
  BookOpen,
  Video,
  Timer,
  Repeat,
  Award,
  Activity,
  X,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'flexibility' | 'balance' | 'cardio' | 'mobility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  sets?: number;
  reps?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
  targetMuscles: string[];
  equipment: string[];
  benefits: string[];
  isCompleted: boolean;
  lastCompleted?: string;
  completionCount: number;
  rating: number;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  exercises: string[]; // exercise IDs
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isActive: boolean;
}

// Mock data
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Shoulder Flexion',
    description: 'Gentle shoulder movement to improve range of motion',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 10,
    sets: 3,
    reps: 15,
    videoUrl: '/videos/shoulder-flexion.mp4',
    thumbnailUrl: '/images/shoulder-flexion.jpg',
    instructions: [
      'Stand or sit with your back straight',
      'Slowly raise your arm forward and up',
      'Hold for 2 seconds at the top',
      'Lower slowly back to starting position'
    ],
    targetMuscles: ['Deltoids', 'Rotator Cuff'],
    equipment: ['None'],
    benefits: ['Improved range of motion', 'Reduced stiffness', 'Better mobility'],
    isCompleted: false,
    completionCount: 0,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Wall Push-ups',
    description: 'Modified push-ups against a wall for upper body strength',
    category: 'strength',
    difficulty: 'beginner',
    duration: 8,
    sets: 2,
    reps: 10,
    videoUrl: '/videos/wall-pushups.mp4',
    thumbnailUrl: '/images/wall-pushups.jpg',
    instructions: [
      'Stand arm\'s length from a wall',
      'Place palms flat against the wall',
      'Lean in and push back slowly',
      'Keep your body straight throughout'
    ],
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
    equipment: ['Wall'],
    benefits: ['Upper body strength', 'Core stability', 'Functional movement'],
    isCompleted: true,
    lastCompleted: '2024-01-15',
    completionCount: 5,
    rating: 4.2
  },
  {
    id: '3',
    name: 'Balance Training',
    description: 'Single leg stance to improve balance and stability',
    category: 'balance',
    difficulty: 'intermediate',
    duration: 15,
    sets: 3,
    reps: 30,
    videoUrl: '/videos/balance-training.mp4',
    thumbnailUrl: '/images/balance-training.jpg',
    instructions: [
      'Stand on one foot',
      'Hold for 30 seconds',
      'Use wall for support if needed',
      'Switch to other foot'
    ],
    targetMuscles: ['Core', 'Ankles', 'Glutes'],
    equipment: ['None'],
    benefits: ['Better balance', 'Fall prevention', 'Core strength'],
    isCompleted: false,
    completionCount: 2,
    rating: 4.0
  },
  {
    id: '4',
    name: 'Knee Extensions',
    description: 'Seated knee strengthening exercise',
    category: 'strength',
    difficulty: 'beginner',
    duration: 12,
    sets: 3,
    reps: 12,
    videoUrl: '/videos/knee-extensions.mp4',
    thumbnailUrl: '/images/knee-extensions.jpg',
    instructions: [
      'Sit in a chair with back straight',
      'Slowly extend one leg',
      'Hold for 2 seconds',
      'Lower slowly'
    ],
    targetMuscles: ['Quadriceps', 'Hip Flexors'],
    equipment: ['Chair'],
    benefits: ['Leg strength', 'Knee stability', 'Functional mobility'],
    isCompleted: true,
    lastCompleted: '2024-01-14',
    completionCount: 8,
    rating: 4.3
  },
  {
    id: '5',
    name: 'Ankle Circles',
    description: 'Gentle ankle mobility exercise',
    category: 'mobility',
    difficulty: 'beginner',
    duration: 5,
    sets: 2,
    reps: 10,
    videoUrl: '/videos/ankle-circles.mp4',
    thumbnailUrl: '/images/ankle-circles.jpg',
    instructions: [
      'Sit comfortably with leg extended',
      'Rotate ankle in circular motion',
      'Complete circles in both directions',
      'Keep movement slow and controlled'
    ],
    targetMuscles: ['Ankle muscles', 'Calves'],
    equipment: ['None'],
    benefits: ['Ankle mobility', 'Circulation', 'Flexibility'],
    isCompleted: false,
    completionCount: 3,
    rating: 4.1
  },
  {
    id: '6',
    name: 'Seated Marching',
    description: 'Seated leg movement for core and hip strength',
    category: 'cardio',
    difficulty: 'beginner',
    duration: 10,
    sets: 1,
    reps: 20,
    videoUrl: '/videos/seated-marching.mp4',
    thumbnailUrl: '/images/seated-marching.jpg',
    instructions: [
      'Sit tall in chair',
      'Lift one knee up',
      'Lower and lift other knee',
      'Continue alternating'
    ],
    targetMuscles: ['Hip Flexors', 'Core', 'Quadriceps'],
    equipment: ['Chair'],
    benefits: ['Cardiovascular health', 'Core strength', 'Hip mobility'],
    isCompleted: true,
    lastCompleted: '2024-01-15',
    completionCount: 4,
    rating: 4.4
  }
];

const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Morning Mobility',
    description: 'Gentle exercises to start your day',
    exercises: ['1', '5'],
    estimatedDuration: 15,
    difficulty: 'beginner',
    category: 'mobility',
    isActive: true
  },
  {
    id: '2',
    name: 'Strength Builder',
    description: 'Build strength with progressive exercises',
    exercises: ['2', '4'],
    estimatedDuration: 20,
    difficulty: 'intermediate',
    category: 'strength',
    isActive: true
  },
  {
    id: '3',
    name: 'Balance & Stability',
    description: 'Improve balance and prevent falls',
    exercises: ['3', '5'],
    estimatedDuration: 25,
    difficulty: 'intermediate',
    category: 'balance',
    isActive: false
  }
];

const Exercises: React.FC = () => {
  const [activeTab, setActiveTab] = useState('exercises');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [showExerciseGuide, setShowExerciseGuide] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    difficulty: 'beginner',
    category: 'general',
    selectedExercises: [] as string[]
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'flexibility':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'balance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mobility':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || exercise.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const stats = {
    totalExercises: exercises.length,
    completedToday: exercises.filter(e => e.lastCompleted === new Date().toISOString().split('T')[0]).length,
    totalCompleted: exercises.reduce((sum, e) => sum + e.completionCount, 0),
    avgRating: exercises.reduce((sum, e) => sum + e.rating, 0) / exercises.length,
    activeWorkouts: workoutPlans.filter(w => w.isActive).length
  };

  const markAsCompleted = (exerciseId: string) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === exerciseId 
        ? { 
            ...exercise, 
            isCompleted: true, 
            lastCompleted: new Date().toISOString().split('T')[0],
            completionCount: exercise.completionCount + 1
          }
        : exercise
    ));
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Library</h1>
          <p className="text-gray-600">Personalized rehabilitation exercises and workout plans</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handleCreateWorkout}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workout
          </Button>
          <Button 
            onClick={handleExerciseGuide}
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Exercise Guide
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Exercises</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExercises}</p>
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
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
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
                <p className="text-sm text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCompleted}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Workouts</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.activeWorkouts}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <option value="all">All Categories</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
          <option value="balance">Balance</option>
          <option value="cardio">Cardio</option>
          <option value="mobility">Mobility</option>
        </select>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border-0 shadow-lg"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="workouts">Workout Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{exercise.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                        <div className="flex gap-2 mb-3">
                          <Badge className={getCategoryColor(exercise.category)}>
                            {exercise.category}
                          </Badge>
                          <Badge className={getDifficultyColor(exercise.difficulty)}>
                            {exercise.difficulty}
                          </Badge>
                        </div>
                      </div>
                      {exercise.isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{exercise.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-gray-400" />
                        <span>{exercise.sets}x{exercise.reps}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{exercise.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>{exercise.completionCount}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Target Muscles:</p>
                      <div className="flex flex-wrap gap-1">
                        {exercise.targetMuscles.slice(0, 2).map((muscle, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => markAsCompleted(exercise.id)}
                        disabled={exercise.isCompleted}
                      >
                        {exercise.isCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans.map((plan) => (
                <Card key={plan.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(plan.difficulty)}>
                            {plan.difficulty}
                          </Badge>
                          {plan.isActive && (
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <span>{plan.estimatedDuration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span>{plan.exercises.length} exercises</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Exercises:</p>
                      <div className="space-y-1">
                        {plan.exercises.slice(0, 3).map((exerciseId, index) => {
                          const exercise = exercises.find(e => e.id === exerciseId);
                          return exercise ? (
                            <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              {exercise.name}
                            </div>
                          ) : null;
                        })}
                        {plan.exercises.length > 3 && (
                          <div className="text-xs text-gray-500">+{plan.exercises.length - 3} more</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Start Workout
                      </Button>
                      <Button size="sm" variant="outline">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Exercises;

  // Handler functions for buttons
  const handleCreateWorkout = () => {
    setShowCreateWorkout(true);
    toast.success('🏋️ Create Workout Dialog Opened!', {
      description: 'Design your custom workout plan',
      duration: 3000
    });
  };

  const handleExerciseGuide = () => {
    setShowExerciseGuide(true);
    toast.success('📖 Exercise Guide Opened!', {
      description: 'Learn proper exercise techniques',
      duration: 3000
    });
  };

  const handleStartWorkout = (planId: string) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (plan) {
      toast.success('🚀 Workout Started!', {
        description: `Starting ${plan.name} - ${plan.estimatedDuration} minutes`,
        duration: 3000
      });
    }
  };

  const handleVideoPlay = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      toast.success('🎥 Video Player Opened!', {
        description: `Playing: ${exercise.name}`,
        duration: 3000
      });
    }
  };

  const handleSaveWorkout = () => {
    if (!newWorkout.name.trim()) {
      toast.error('❌ Workout name is required');
      return;
    }
    if (newWorkout.selectedExercises.length === 0) {
      toast.error('❌ Please select at least one exercise');
      return;
    }

    const workout: WorkoutPlan = {
      id: `workout_${Date.now()}`,
      name: newWorkout.name,
      description: newWorkout.description,
      exercises: newWorkout.selectedExercises,
      estimatedDuration: newWorkout.selectedExercises.length * 10, // Estimate 10 min per exercise
      difficulty: newWorkout.difficulty as 'beginner' | 'intermediate' | 'advanced',
      category: newWorkout.category,
      isActive: false
    };

    setWorkoutPlans(prev => [...prev, workout]);
    setShowCreateWorkout(false);
    setNewWorkout({
      name: '',
      description: '',
      difficulty: 'beginner',
      category: 'general',
      selectedExercises: []
    });

    toast.success('✅ Workout Created Successfully!', {
      description: `${workout.name} has been added to your workout plans`,
      duration: 3000
    });
  };

      {/* Create Workout Modal */}
      <Dialog open={showCreateWorkout} onOpenChange={setShowCreateWorkout}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Workout Plan
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workout name"
                />
              </div>
              <div>
                <Label htmlFor="workout-difficulty">Difficulty</Label>
                <Select value={newWorkout.difficulty} onValueChange={(value) => setNewWorkout(prev => ({ ...prev, difficulty: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="workout-description">Description</Label>
              <Textarea
                id="workout-description"
                value={newWorkout.description}
                onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your workout plan"
                rows={3}
              />
            </div>
            <div>
              <Label>Select Exercises</Label>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-md p-4">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={exercise.id}
                      checked={newWorkout.selectedExercises.includes(exercise.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewWorkout(prev => ({
                            ...prev,
                            selectedExercises: [...prev.selectedExercises, exercise.id]
                          }));
                        } else {
                          setNewWorkout(prev => ({
                            ...prev,
                            selectedExercises: prev.selectedExercises.filter(id => id !== exercise.id)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={exercise.id} className="flex-1 cursor-pointer">
                      {exercise.name} - {exercise.targetMuscles.join(', ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateWorkout(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveWorkout} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Workout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercise Guide Modal */}
      <Dialog open={showExerciseGuide} onOpenChange={setShowExerciseGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Exercise Guide & Techniques
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {exercise.name}
                      <Badge variant={exercise.difficulty === 'beginner' ? 'secondary' : exercise.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                        {exercise.difficulty}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2"><strong>Target Muscles:</strong> {exercise.targetMuscles.join(', ')}</p>
                      <p className="text-sm text-gray-600 mb-2"><strong>Duration:</strong> {exercise.duration} minutes</p>
                      <p className="text-sm text-gray-700">{exercise.description}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Instructions:</h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {exercise.instructions.map((instruction, index) => (
                          <li key={index}>{index + 1}. {instruction}</li>
                        ))}
                      </ol>
                    </div>
                    <Button 
                      onClick={() => handleVideoPlay(exercise.id)}
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Watch Demo Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowExerciseGuide(false)}>
                <X className="w-4 h-4 mr-2" />
                Close Guide
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Exercises;

  // Handler functions for buttons
  const handleCreateWorkout = () => {
    setShowCreateWorkout(true);
    toast.success('🏋️ Create Workout Dialog Opened!', {
      description: 'Design your custom workout plan',
      duration: 3000
    });
  };

  const handleExerciseGuide = () => {
    setShowExerciseGuide(true);
    toast.success('📖 Exercise Guide Opened!', {
      description: 'Learn proper exercise techniques',
      duration: 3000
    });
  };

  const handleStartWorkout = (planId: string) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (plan) {
      toast.success('🚀 Workout Started!', {
        description: `Starting ${plan.name} - ${plan.estimatedDuration} minutes`,
        duration: 3000
      });
    }
  };

  const handleVideoPlay = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      toast.success('🎥 Video Player Opened!', {
        description: `Playing: ${exercise.name}`,
        duration: 3000
      });
    }
  };

  const handleSaveWorkout = () => {
    if (!newWorkout.name.trim()) {
      toast.error('❌ Workout name is required');
      return;
    }
    if (newWorkout.selectedExercises.length === 0) {
      toast.error('❌ Please select at least one exercise');
      return;
    }

    const workout: WorkoutPlan = {
      id: `workout_${Date.now()}`,
      name: newWorkout.name,
      description: newWorkout.description,
      exercises: newWorkout.selectedExercises,
      estimatedDuration: newWorkout.selectedExercises.length * 10, // Estimate 10 min per exercise
      difficulty: newWorkout.difficulty as 'beginner' | 'intermediate' | 'advanced',
      category: newWorkout.category,
      isActive: false
    };

    setWorkoutPlans(prev => [...prev, workout]);
    setShowCreateWorkout(false);
    setNewWorkout({
      name: '',
      description: '',
      difficulty: 'beginner',
      category: 'general',
      selectedExercises: []
    });

    toast.success('✅ Workout Created Successfully!', {
      description: `${workout.name} has been added to your workout plans`,
      duration: 3000
    });
  };