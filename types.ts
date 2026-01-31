
export interface User {
  id: string;
  name: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Elite';
  avatar: string;
}

export interface GymClass {
  id: string;
  name: string;
  coach: string;
  time: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  capacity: number;
  booked: number;
  type: string;
}

export interface TribePost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  image?: string;
}

export enum Page {
  HOME = 'home',
  BOOKING = 'booking',
  PROFILE = 'profile',
  COMMUNITY = 'community',
  SMART_PASS = 'smart-pass',
  LOGIN = 'login',
  SHOP = 'shop',
  ARENA = 'arena'
}

export interface Supplement {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Protein' | 'Pre-Workout' | 'Vitamins' | 'Gear';
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  image: string;
  available: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  avatar: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  participants: number;
  reward: string;
  image: string;
}

