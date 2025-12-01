// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('lab2home_token');
};

// Set auth token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('lab2home_token', token);
};

// Remove auth token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem('lab2home_token');
};

// Generic API request function
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log('📤 Request options:', { url, method: options.method, body: options.body });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📥 Response status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    return data;
  } catch (error) {
    console.error('❌ API Request Error:', error);
    console.error('URL was:', url);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Unified login - automatically detects patient, lab, or phlebotomist
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Patient login (legacy)
  loginPatient: async (email: string, password: string) => {
    return apiRequest('/auth/login/patient', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Lab login (legacy)
  loginLab: async (email: string, password: string) => {
    return apiRequest('/auth/login/lab', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user
  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Patient signup
  signupPatient: async (data: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
    password: string;
  }) => {
    return apiRequest('/auth/signup/patient', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Lab signup
  signupLab: async (data: {
    fullName: string;
    email: string;
    phone: string;
    labName: string;
    licenseNumber: string;
    labAddress: string;
    password: string;
  }) => {
    return apiRequest('/auth/signup/lab', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify OTP
  verifyOTP: async (email: string, otp: string, userType: 'patient' | 'lab' | 'phlebotomist') => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, userType }),
    });
  },

  // Resend OTP
  resendOTP: async (email: string, userType: 'patient' | 'lab' | 'phlebotomist') => {
    return apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, userType }),
    });
  },

  // Phlebotomist signup (with file upload)
  signupPhlebotomist: async (data: {
    fullName: string;
    email: string;
    phone: string;
    qualification: string;
    password: string;
    trafficLicenseCopy: File;
  }) => {
    // Use FormData for file upload
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('qualification', data.qualification);
    formData.append('password', data.password);
    formData.append('trafficLicenseCopy', data.trafficLicenseCopy);

    // Don't use apiRequest for file uploads - fetch directly
    const token = localStorage.getItem('lab2home_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:5000/api/auth/signup/phlebotomist', {
      method: 'POST',
      headers,
      body: formData, // Don't set Content-Type - browser will set it with boundary
    });

    return await response.json();
  },

  // Forgot password - request OTP
  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify reset OTP
  verifyResetOTP: async (email: string, otp: string) => {
    return apiRequest('/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Reset password
  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },
};

// Lab API functions
export const updateLabTests = async (labId: string, testIds: string[]): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/labs/${labId}/tests`, {
    method: 'PUT',
    body: JSON.stringify({ testIds }),
  });
};

// ============================================
// NOTIFICATION APIs
// ============================================

export const getUserNotifications = async (userId: string, unreadOnly: boolean = false): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/notifications/${userId}?unreadOnly=${unreadOnly}`);
};

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  });
};

export const markAllNotificationsAsRead = async (userId: string): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/notifications/read-all`, {
    method: 'PUT',
    body: JSON.stringify({ userId }),
  });
};

export const deleteNotification = async (notificationId: string): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/notifications/${notificationId}`, {
    method: 'DELETE',
  });
};

export const uploadReport = async (bookingId: string, file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('report', file);

  const token = localStorage.getItem('lab2home_token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/upload-report`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return await response.json();
};

export default apiRequest;
