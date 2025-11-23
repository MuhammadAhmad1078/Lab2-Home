import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, setToken, removeToken } from "@/lib/api";

type UserRole = "patient" | "lab" | "phlebotomist" | "admin";

interface User {
  id: string;
  email: string;
  fullName: string;
  userType: UserRole;
  role: UserRole; // For compatibility with ProtectedRoute
  phone?: string;
  labName?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("lab2home_token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          if (response.success && response.data) {
            const userData: User = {
              id: response.data.id,
              email: response.data.email,
              fullName: response.data.fullName,
              userType: response.data.userType,
              role: response.data.userType, // Set role same as userType
              phone: response.data.phone,
              labName: response.data.labName,
              address: response.data.address,
            };
            setUser(userData);
          } else {
            removeToken();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Call unified login endpoint - auto-detects patient or lab
      const response = await authAPI.login(email, password);

      if (response.success && response.data) {
        // Save token
        setToken(response.data.token);
        
        // Set user data
        const userData: User = {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          userType: response.data.user.userType,
          role: response.data.user.userType, // Set role same as userType
          phone: response.data.user.phone,
          labName: response.data.user.labName,
          address: response.data.user.address,
        };
        
        setUser(userData);
        localStorage.setItem("lab2home_user", JSON.stringify(userData));
        
        // Navigate based on user type
        navigate(`/${userData.userType}`);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("lab2home_user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
