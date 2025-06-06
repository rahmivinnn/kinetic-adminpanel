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
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Knee Flexion Stretch',
    description: 'Gentle knee flexion exercise to improve range of motion',
    category: 'flexibility',
    difficulty: 'beginner',
    duration: 5,
    sets: 3,
    reps: 10,
    thumbnailUrl: '/placeholder.svg',
    instructions: [
      'Sit on a chair with your back straight',
      'Slowly bend your knee, bringing your heel toward your buttocks',
      'Hold for 5 seconds',
      'Slowly return to starting position',
      'Repeat for prescribed repetitions'
    ],
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Knee Joint'],
    equipment: ['Chair'],
    benefits: ['Improves knee flexibility', 'Reduces stiffness', 'Enhances range of motion'],
    isCompleted: true,
    lastCompleted: '2024-01-14',
    completionCount: 12,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Shoulder Blade Squeeze',
    description: 'Strengthen upper back and improve posture',
    category: 'strength',
    difficulty: 'beginner',
    duration: 8,
    sets: 2,
    reps: 15,
    thumbnailUrl: '/placeholder.svg',
    instructions: [
      'Sit or stand with arms at your sides',
      'Squeeze your shoulder blades together',
      'Hold for 3 seconds',
      'Slowly release',
      'Keep your shoulders down and relaxed'
    ],
    targetMuscles: ['Rhomboids', 'Middle Trapezius', 'Rear Deltoids'],
    equipment: ['None'],
    benefits: ['Improves posture', 'Strengthens upper back', 'Reduces shoulder tension'],
    isCompleted: false,
    completionCount: 8,
    rating: 4.2
  },
  {
    id: '3',
    name: 'Single Leg Balance',
    description: 'Improve balance and proprioception',
    category: 'balance',
    difficulty: 'intermediate',
    duration: 10,
    sets: 3,
    reps: 30, // seconds
    thumbnailUrl: '/placeholder.svg',
    instructions: [
      'Stand near a wall or chair for support if needed',
      'Lift one foot off the ground',
      'Balance on one leg for 30 seconds',
      'Keep your core engaged',
      'Switch legs and repeat'
    ],
    targetMuscles: ['Core', 'Ankle Stabilizers', 'Hip Stabilizers'],
    equipment: ['None'],
    benefits: ['Improves balance', 'Enhances proprioception', 'Strengthens stabilizing muscles'],
    isCompleted: true,
    lastCompleted: '2024-01-13',
    completionCount: 15,
    rating: 4.7
  },
  {
    id: '4',
    name: 'Ankle Circles',
    description: 'Improve ankle mobility and circulation',
    category: 'mobility',
    difficulty: 'beginner',
    duration: 3,
    sets: 2,
    reps: 10,
    thumbnailUrl: '/placeholder.svg',
    instructions: [
      'Sit comfortably with one leg extended',
      'Slowly rotate your ankle in a circular motion',
      'Complete 10 circles in one direction',
      'Reverse direction for 10 more circles',
      'Switch to the other ankle'
    ],
    targetMuscles: ['Ankle Joint', 'Calf Muscles', 'Shin Muscles'],
    equipment: ['None'],
    benefits: ['Improves ankle mobility', 'Enhances circulation', 'Reduces stiffness'],
    isCompleted: false,
    completionCount: 5,
    rating: 4.0
  },
  {
    id: '5',
    name: 'Wall Push-ups',
    description: 'Modified push-up for upper body strength',
    category: 'strength',
    difficulty: 'beginner',
    duration: 6,
    sets: 2,
    reps: 12,
    thumbnailUrl: '/placeholder.svg',
    instructions: [
      'Stand arm\'s length from a wall',
      'Place palms flat against the wall at shoulder height',
      'Lean forward and push back to starting position',
      'Keep your body straight throughout the movement',
      'Control the movement both ways'
    ],
    targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    equipment: ['Wall'],
    benefits: ['Builds upper body strength', 'Improves functional movement', 'Low impact'],
    isCompleted: true,
    lastCompleted: '2024-01-15',
    completionCount: 10,
    rating: 4.3
  }
];

const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Morning Mobility Routine',
    description: 'Gentle exercises to start your day',
    exercises: ['1', '4'],
    estimatedDuration: 15,
    difficulty: 'beginner',
    category: 'Daily Routine',
    isActive: true
  },
  {
    id: '2',
    name: 'Strength Building Program',
    description: 'Progressive strength exercises',
    exercises: ['2', '5'],
    estimatedDuration: 25,
    difficulty: 'intermediate',
    category: 'Strength',
    isActive: false
  },
  {
    id: '3',
    name: 'Balance & Stability',
    description: 'Improve balance and coordination',
    exercises: ['3'],
    estimatedDuration: 20,
    difficulty: 'intermediate',
    category: 'Balance',
    isActive: true
  }
];

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('exercises');

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
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exercise Library
          </h1>
          <p className="text-gray-600 mt-1">Track your rehabilitation exercises and workout plans</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Exercise
        </Button>
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
                <p className="text-sm text-gray-600">Total Exercises</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExercises}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
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

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCompleted}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-blue-600">{stats.avgRating.toFixed(1)}</p>
              <div className="mt-2">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.activeWorkouts}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
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
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="exercises">Exercise Library</TabsTrigger>
            <TabsTrigger value="workouts">Workout Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border-0 shadow-lg"
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
                  className="px-3 py-2 rounded-lg bg-white/70 backdrop-blur-sm border-0 shadow-lg"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{exercise.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                            <div className="flex gap-2 mb-3">
                              <Badge className={`${getCategoryColor(exercise.category)} border text-xs`}>
                                {exercise.category}
                              </Badge>
                              <Badge className={`${getDifficultyColor(exercise.difficulty)} text-xs`}>
                                {exercise.difficulty}
                              </Badge>
                            </div>
                          </div>
                          {exercise.isCompleted && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>

                        {/* Exercise Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{exercise.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Repeat className="w-4 h-4" />
                            <span>{exercise.sets} sets × {exercise.reps}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Award className="w-4 h-4" />
                            <span>{exercise.completionCount} times</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Star className="w-4 h-4" />
                            <span>{exercise.rating}/5</span>
                          </div>
                        </div>

                        {/* Target Muscles */}
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Target Muscles:</p>
                          <div className="flex flex-wrap gap-1">
                            {exercise.targetMuscles.slice(0, 3).map((muscle, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {muscle}
                              </span>
                            ))}
                            {exercise.targetMuscles.length > 3 && (
                              <span className="text-xs text-gray-500">+{exercise.targetMuscles.length - 3} more</span>
                            )}
                          </div>
                        </div>

                        {/* Equipment */}
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Equipment:</p>
                          <p className="text-xs text-gray-600">{exercise.equipment.join(', ')}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => markAsCompleted(exercise.id)}
                            disabled={exercise.isCompleted}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            {/* Workout Plans */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workoutPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                            <div className="flex gap-2">
                              <Badge className={`${getDifficultyColor(plan.difficulty)} text-xs`}>
                                {plan.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {plan.category}
                              </Badge>
                              {plan.isActive && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4" />
                            <span>{plan.estimatedDuration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            <span>{plan.exercises.length} exercises</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start Workout
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
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

export default Exercises;