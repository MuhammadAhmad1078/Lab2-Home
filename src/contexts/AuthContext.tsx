import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type UserRole = "patient" | "lab" | "phlebotomist" | "admin";

interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS = [
  { email: "patient@lab2home.com", password: "patient123", role: "patient" as UserRole, name: "John Patient" },
  { email: "lab@lab2home.com", password: "lab123", role: "lab" as UserRole, name: "Lab Manager" },
  { email: "phlebotomist@lab2home.com", password: "phleb123", role: "phlebotomist" as UserRole, name: "Sarah Collector" },
  { email: "admin@lab2home.com", password: "admin123", role: "admin" as UserRole, name: "Admin User" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("lab2home_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = { email: foundUser.email, role: foundUser.role, name: foundUser.name };
      setUser(userData);
      localStorage.setItem("lab2home_user", JSON.stringify(userData));
      navigate(`/${foundUser.role}`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lab2home_user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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

