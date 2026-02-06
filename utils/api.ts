// API Service for MG Club Fitness
// Centralized API calls to the backend

const API_BASE_URL = 'http://localhost:5094/api/v1';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============================================================================
// Types matching backend models
// ============================================================================

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Elite';
  streakDays: number;
  createdAt: string;
  // Contract freeze fields
  isContractFrozen: boolean;
  freezeStartDate?: string;
  freezeEndDate?: string;
  hasUsedFreeze: boolean;
}

export interface ApiCoach {
  id: string;
  name: string;
  bio: string;
  tagline: string;
  imageUrl: string;
  experienceYears: number;
  specialties: string[];
  isAvailable: boolean;
}

export interface ApiGymClass {
  id: string;
  coachId: string;
  coach?: ApiCoach;
  name: string;
  type: string;
  startTime: string;
  durationMinutes: number;
  intensity: 'Low' | 'Medium' | 'High';
  capacity: number;
  scheduleDate: string;
  bookings?: ApiBooking[];
}

export interface ApiBooking {
  id: string;
  userId: string;
  classId: string;
  gymClass?: ApiGymClass;
  status: 'Booked' | 'Waitlisted' | 'Cancelled';
  bookedAt: string;
}

export interface ApiPost {
  id: string;
  userId: string;
  user?: ApiUser;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}

export interface ApiChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Elite';
  reward: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: 'Protein' | 'PreWorkout' | 'Vitamins' | 'Gear';
  stock: number;
}

export interface ApiOrder {
  id: string;
  userId: string;
  items: ApiOrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface ApiOrderItem {
  id: string;
  productId: string;
  product?: ApiProduct;
  quantity: number;
  unitPrice: number;
}

export interface ApiBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  async register(name: string, email: string, password: string): Promise<ApiUser> {
    return apiCall<ApiUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        passwordHash: password,
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
        points: 0,
        tier: 'Bronze',
        streakDays: 0,
      }),
    });
  },

  async login(email: string, password: string): Promise<ApiUser> {
    return apiCall<ApiUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(email: string): Promise<ApiUser> {
    return apiCall<ApiUser>(`/auth/me?email=${encodeURIComponent(email)}`);
  },
};

// ============================================================================
// Classes API
// ============================================================================

export const classesApi = {
  async getAll(date?: string): Promise<ApiGymClass[]> {
    const query = date ? `?date=${date}` : '';
    return apiCall<ApiGymClass[]>(`/classes${query}`);
  },

  async getById(id: string): Promise<ApiGymClass> {
    return apiCall<ApiGymClass>(`/classes/${id}`);
  },
};

// ============================================================================
// Bookings API
// ============================================================================

export const bookingsApi = {
  async getByUser(userId: string): Promise<ApiBooking[]> {
    return apiCall<ApiBooking[]>(`/bookings?userId=${userId}`);
  },

  async create(userId: string, classId: string): Promise<ApiBooking> {
    return apiCall<ApiBooking>('/bookings', {
      method: 'POST',
      body: JSON.stringify({ userId, classId }),
    });
  },

  async cancel(id: string): Promise<void> {
    return apiCall<void>(`/bookings/${id}`, { method: 'DELETE' });
  },
};

// ============================================================================
// Coaches API
// ============================================================================

export const coachesApi = {
  async getAll(): Promise<ApiCoach[]> {
    return apiCall<ApiCoach[]>('/coaches');
  },

  async getById(id: string): Promise<ApiCoach> {
    return apiCall<ApiCoach>(`/coaches/${id}`);
  },
};

// ============================================================================
// Posts API (Community)
// ============================================================================

export const postsApi = {
  async getAll(limit: number = 20): Promise<ApiPost[]> {
    return apiCall<ApiPost[]>(`/posts?limit=${limit}`);
  },

  async create(userId: string, content: string, imageUrl?: string): Promise<ApiPost> {
    return apiCall<ApiPost>('/posts', {
      method: 'POST',
      body: JSON.stringify({ userId, content, imageUrl }),
    });
  },

  async like(postId: string, userId: string): Promise<{ liked: boolean }> {
    return apiCall<{ liked: boolean }>(`/posts/${postId}/like?userId=${userId}`, {
      method: 'POST',
    });
  },

  async delete(id: string): Promise<void> {
    return apiCall<void>(`/posts/${id}`, { method: 'DELETE' });
  },
};

// ============================================================================
// Challenges API
// ============================================================================

export const challengesApi = {
  async getAll(): Promise<ApiChallenge[]> {
    return apiCall<ApiChallenge[]>('/challenges');
  },

  async getById(id: string): Promise<ApiChallenge> {
    return apiCall<ApiChallenge>(`/challenges/${id}`);
  },

  async join(challengeId: string, userId: string): Promise<void> {
    return apiCall<void>(`/challenges/${challengeId}/join?userId=${userId}`, {
      method: 'POST',
    });
  },
};

// ============================================================================
// Products API (Shop)
// ============================================================================

export const productsApi = {
  async getAll(category?: string): Promise<ApiProduct[]> {
    const query = category ? `?category=${category}` : '';
    return apiCall<ApiProduct[]>(`/products${query}`);
  },

  async getById(id: string): Promise<ApiProduct> {
    return apiCall<ApiProduct>(`/products/${id}`);
  },
};

// ============================================================================
// Orders API
// ============================================================================

export const ordersApi = {
  async getByUser(userId: string): Promise<ApiOrder[]> {
    return apiCall<ApiOrder[]>(`/orders?userId=${userId}`);
  },

  async create(userId: string, items: { productId: string; quantity: number; unitPrice: number }[]): Promise<ApiOrder> {
    return apiCall<ApiOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify({ userId, items }),
    });
  },
};

// ============================================================================
// Leaderboard API
// ============================================================================

export const leaderboardApi = {
  async get(limit: number = 10): Promise<ApiUser[]> {
    return apiCall<ApiUser[]>(`/users/leaderboard?limit=${limit}`);
  },
};

// ============================================================================
// Badges API
// ============================================================================

export const badgesApi = {
  async getAll(): Promise<ApiBadge[]> {
    return apiCall<ApiBadge[]>('/badges');
  },
};

// ============================================================================
// Smart Pass API
// ============================================================================

export const smartPassApi = {
  async scan(userId: string, token: string): Promise<{ success: boolean }> {
    return apiCall<{ success: boolean }>(`/smartpass/scan?userId=${userId}&token=${token}`, {
      method: 'POST',
    });
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch('http://localhost:5094/health');
    return response.json();
  },
};

// ============================================================================
// Contract API
// ============================================================================

export interface ContractStatus {
  status: 'Active' | 'Frozen';
  isContractFrozen: boolean;
  freezeStartDate?: string;
  freezeEndDate?: string;
  daysRemaining: number;
  canFreeze: boolean;
  hasUsedFreeze: boolean;
}

export interface ContractFreezeResponse {
  message: string;
  id: string;
  isContractFrozen: boolean;
  freezeStartDate?: string;
  freezeEndDate?: string;
  hasUsedFreeze: boolean;
}

export const contractApi = {
  async freeze(userId: string): Promise<ContractFreezeResponse> {
    return apiCall<ContractFreezeResponse>(`/users/${userId}/contract/freeze`, {
      method: 'POST',
    });
  },

  async unfreeze(userId: string): Promise<ContractFreezeResponse> {
    return apiCall<ContractFreezeResponse>(`/users/${userId}/contract/unfreeze`, {
      method: 'POST',
    });
  },

  async getStatus(userId: string): Promise<ContractStatus> {
    return apiCall<ContractStatus>(`/users/${userId}/contract/status`);
  },
};

// ============================================================================
// Gym Traffic & Forecast API
// ============================================================================

export interface ApiTraffic {
  currentOccupancy: number;
  maxCapacity: number;
  percentage: number;
  status: 'Low' | 'Moderate' | 'High';
  timestamp: string;
}

export interface ApiForecast {
  forecast: { hour: number; label: string; occupancy: number }[];
  peakHour: string;
  bestTime: string;
  date: string;
}

export const gymApi = {
  async getTraffic(): Promise<ApiTraffic> {
    return apiCall<ApiTraffic>('/gym/traffic');
  },

  async getForecast(): Promise<ApiForecast> {
    return apiCall<ApiForecast>('/gym/forecast');
  },
};

// ============================================================================
// Calories API
// ============================================================================

export interface CalorieResult {
  bmr: number;
  tdee: number;
  goalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CalorieRequest {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
}

export const caloriesApi = {
  async calculate(data: CalorieRequest): Promise<CalorieResult> {
    return apiCall<CalorieResult>('/calories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getLogs(userId: string): Promise<{ date: string; bmr: number; tdee: number }[]> {
    return apiCall('/calories?userId=' + userId);
  },
};
