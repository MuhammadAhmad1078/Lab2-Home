import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Squares from "@/components/home/Squares";
import Footer from "@/components/shared/Footer";
import CardNav from "@/components/home/CardNav";
import { 
  UserPlus, Mail, Lock, User, Phone, Calendar, 
  FlaskConical, ArrowLeft, Building2,
  GraduationCap, MapPin, FileText, Bike
} from "lucide-react";
import logo from "/logo.svg";

// Role types
type UserRole = "patient" | "lab" | "phlebotomist";

// Base schema for all roles
const baseSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
});

// Patient-specific schema
const patientSchema = baseSchema.extend({
  role: z.literal("patient"),
  dateOfBirth: z.string().min(1, "Please select your date of birth"),
  address: z.string().min(5, "Please enter your address"),
});

// Lab-specific schema
const labSchema = baseSchema.extend({
  role: z.literal("lab"),
  labName: z.string().min(2, "Please enter lab name"),
  licenseNumber: z.string().min(5, "Please enter your lab license number"),
  labAddress: z.string().min(5, "Please enter lab address"),
});

// Phlebotomist-specific schema
const phlebotomistSchema = baseSchema.extend({
  role: z.literal("phlebotomist"),
  qualification: z.string().min(2, "Please enter your qualification"),
  trafficLicenseCopy: z.instanceof(File, { message: "Please upload your traffic license copy" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type),
      "File must be an image (JPEG, PNG) or PDF"
    ),
});

// Combined schema with refinement
const signupSchema = z.discriminatedUnion("role", [
  patientSchema,
  labSchema,
  phlebotomistSchema,
]).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

// Role selection component
const RoleSelection = ({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) => {
  const roles = [
    {
      id: "patient" as UserRole,
      title: "Patient",
      description: "Book tests, view reports, and manage your health records",
      icon: User,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: "lab" as UserRole,
      title: "Lab",
      description: "Manage sample collection, process tests, and update results",
      icon: FlaskConical,
      color: "text-health",
      bgColor: "bg-health/10",
    },
    {
      id: "phlebotomist" as UserRole,
      title: "Phlebotomist",
      description: "Collect samples at patient locations and manage collections",
      icon: Bike,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">Select Your Role</h3>
        <p className="text-sm text-muted-foreground">Choose the account type that best describes you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.id}
              className="cursor-pointer hover:border-primary hover:shadow-medium transition-all duration-300"
              onClick={() => onSelectRole(role.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`${role.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${role.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{role.title}</h4>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Patient form component
const PatientForm = ({ form, onSubmit }: { form: any; onSubmit: (data: any) => void }) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Full Name
          </FormLabel>
          <FormControl>
            <Input placeholder="John Doe" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </FormLabel>
          <FormControl>
            <Input type="email" placeholder="john@example.com" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </FormLabel>
          <FormControl>
            <Input type="tel" placeholder="+92 XXX XXXXXXX" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Date of Birth
          </FormLabel>
          <FormControl>
            <Input type="date" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Address
          </FormLabel>
          <FormControl>
            <Input placeholder="Your complete address" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Password
          </FormLabel>
          <FormControl>
            <Input type="password" placeholder="••••••••" className="h-11" {...field} />
          </FormControl>
          <FormDescription className="text-xs">Must be at least 8 characters</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Confirm Password
          </FormLabel>
          <FormControl>
            <Input type="password" placeholder="••••••••" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button
      type="submit"
      size="lg"
      className="w-full text-lg py-6 shadow-medium hover:shadow-strong transition-all duration-300 group"
    >
      <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
      Create Patient Account
    </Button>
  </form>
);


// Lab form component
const LabForm = ({ form, onSubmit }: { form: any; onSubmit: (data: any) => void }) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Contact Person Name
          </FormLabel>
          <FormControl>
            <Input placeholder="John Doe" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </FormLabel>
          <FormControl>
            <Input type="email" placeholder="lab@example.com" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </FormLabel>
          <FormControl>
            <Input type="tel" placeholder="+92 XXX XXXXXXX" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="labName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Lab Name
          </FormLabel>
          <FormControl>
            <Input placeholder="ABC Diagnostic Lab" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="licenseNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Lab License Number
          </FormLabel>
          <FormControl>
            <Input placeholder="LAB-XXXXX" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="labAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Lab Address
          </FormLabel>
          <FormControl>
            <Input placeholder="Lab's complete address" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Password
          </FormLabel>
          <FormControl>
            <Input type="password" placeholder="••••••••" className="h-11" {...field} />
          </FormControl>
          <FormDescription className="text-xs">Must be at least 8 characters</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Confirm Password
          </FormLabel>
          <FormControl>
            <Input type="password" placeholder="••••••••" className="h-11" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button
      type="submit"
      size="lg"
      className="w-full text-lg py-6 shadow-medium hover:shadow-strong transition-all duration-300 group"
    >
      <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
      Create Lab Account
    </Button>
  </form>
);

// Phlebotomist form component
const PhlebotomistForm = ({ form, onSubmit }: { form: any; onSubmit: (data: any) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Full Name
            </FormLabel>
            <FormControl>
              <Input placeholder="John Doe" className="h-11" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              Email Address
            </FormLabel>
            <FormControl>
              <Input type="email" placeholder="phlebotomist@example.com" className="h-11" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Phone Number
            </FormLabel>
            <FormControl>
              <Input type="tel" placeholder="+92 XXX XXXXXXX" className="h-11" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="qualification"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Qualification
            </FormLabel>
            <FormControl>
              <Input placeholder="Certified Phlebotomist, Medical Lab Technician, etc." className="h-11" {...field} />
            </FormControl>
            <FormDescription className="text-xs">Enter your professional qualification or certification</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="trafficLicenseCopy"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Traffic License Copy
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        onChange(file);
                      }
                    }}
                  />
                </div>
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
                    <FileText className="w-4 h-4" />
                    <span className="flex-1 truncate">{selectedFile.name}</span>
                    <span className="text-xs">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription className="text-xs">
              Upload a clear copy of your traffic license (Image or PDF, max 5MB)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Password
            </FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" className="h-11" {...field} />
            </FormControl>
            <FormDescription className="text-xs">Must be at least 8 characters</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Confirm Password
            </FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" className="h-11" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6 shadow-medium hover:shadow-strong transition-all duration-300 group"
      >
        <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        Create Phlebotomist Account
      </Button>
    </form>
  );
};

// Form wrapper component that recreates form when role changes
const RoleBasedForm = ({ role, onBack }: { role: UserRole; onBack: () => void }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Get the appropriate schema based on role
  const getSchema = (role: UserRole) => {
    const base = (schema: z.ZodObject<any>) => 
      schema.refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });

    switch (role) {
      case "patient":
        return base(patientSchema);
      case "lab":
        return base(labSchema);
      case "phlebotomist":
        return base(phlebotomistSchema);
    }
  };

  // Get default values based on role
  const getDefaultValues = (role: UserRole) => {
    const base = {
      role,
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    switch (role) {
      case "patient":
        return { ...base, dateOfBirth: "", address: "" };
      case "lab":
        return {
          ...base,
          labName: "",
          licenseNumber: "",
          labAddress: "",
        };
      case "phlebotomist":
        return {
          ...base,
          qualification: "",
          trafficLicenseCopy: undefined as any,
        };
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getSchema(role)),
    defaultValues: getDefaultValues(role),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      console.log("🚀 Starting signup with data:", data);

      // Call appropriate API based on role
      let response;
      if (role === "patient") {
        console.log("📞 Calling patient signup API...");
        response = await authAPI.signupPatient({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          password: data.password,
        });
        console.log("✅ Patient signup response:", response);
      } else if (role === "lab") {
        console.log("📞 Calling lab signup API...");
        response = await authAPI.signupLab({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          labName: data.labName,
          licenseNumber: data.licenseNumber,
          labAddress: data.labAddress,
          password: data.password,
        });
        console.log("✅ Lab signup response:", response);
      } else if (role === "phlebotomist") {
        console.log("📞 Calling phlebotomist signup API...");
        response = await authAPI.signupPhlebotomist({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          qualification: data.qualification,
          password: data.password,
          trafficLicenseCopy: data.trafficLicenseCopy,
        });
        console.log("✅ Phlebotomist signup response:", response);
      }

      if (response && response.success) {
        setSignupEmail(data.email);
        toast({
          title: "Success!",
          description: "OTP sent to your email. Please check your inbox.",
        });
        // Show OTP dialog
        setShowOTPDialog(true);
      } else {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: response?.message || "Please try again.",
        });
      }
    } catch (error: any) {
      console.error("❌ Signup error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        errorMessage = "Cannot connect to server. Make sure backend is running on port 5000.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.verifyOTP(signupEmail, otp, role);

      if (response.success && response.data) {
        // Save token
        localStorage.setItem('lab2home_token', response.data.token);
        
        toast({
          title: "Email Verified!",
          description: "Your account has been created successfully.",
        });
        
        // Navigate to appropriate dashboard
        navigate(`/${role}`);
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: response.message || "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!showOTPDialog ? (
        <>
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 -ml-2"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Role
          </Button>

          <Form {...form}>
            {role === "patient" && <PatientForm form={form} onSubmit={onSubmit} />}
            {role === "lab" && <LabForm form={form} onSubmit={onSubmit} />}
            {role === "phlebotomist" && <PhlebotomistForm form={form} onSubmit={onSubmit} />}
          </Form>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Verify Your Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a 6-digit OTP to <strong>{signupEmail}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Enter OTP</label>
              <Input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                authAPI.resendOTP(signupEmail, role);
                toast({
                  title: "OTP Resent",
                  description: "Please check your email.",
                });
              }}
              disabled={isLoading}
              className="w-full"
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case "patient":
        return "Patient";
      case "lab":
        return "Lab";
      case "phlebotomist":
        return "Phlebotomist";
    }
  };

  const navItems = [
    {
      label: "Services",
      bgColor: "hsl(200 85% 45%)",
      textColor: "#fff",
      links: [
        { label: "Diagnostic Tests", href: "/", ariaLabel: "View diagnostic tests" },
        { label: "Home Collection", href: "/", ariaLabel: "Home sample collection" },
        { label: "AI Reports", href: "/", ariaLabel: "AI-powered report analysis" }
      ]
    },
    {
      label: "About",
      bgColor: "hsl(180 65% 50%)",
      textColor: "#fff",
      links: [
        { label: "How It Works", href: "/", ariaLabel: "Learn how it works" },
        { label: "Our Team", href: "/", ariaLabel: "Meet our team" }
      ]
    },
    {
      label: "Contact",
      bgColor: "hsl(150 70% 45%)",
      textColor: "#fff",
      links: [
        { label: "Support", href: "/", ariaLabel: "Contact support" },
        { label: "Book Test", href: "/login", ariaLabel: "Sign in to book" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-12">
        <CardNav
          logo={logo}
          logoAlt="Lab2Home Logo"
          items={navItems}
          baseColor="#fff"
          menuColor="hsl(200 85% 45%)"
          buttonLink="/login"
          onExpandChange={setIsNavExpanded}
        />
        <Squares speed={0.5} squareSize={40} direction="diagonal" />
        
        {/* Animated Title - Shows when navbar is closed, hides when nav cards appear */}
        <div 
          className={`absolute top-24 md:top-32 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl text-center z-[1] transition-all duration-400 ${
            isNavExpanded ? 'opacity-0 scale-95 -translate-y-8 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Join{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Lab2Home
              </span>
              {" "}Today
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-pulse">
              Healthcare at Your Doorstep
            </p>
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 w-full max-w-2xl pointer-events-none pt-96 md:pt-72">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 shadow-soft mb-6 mx-auto w-fit">
              <UserPlus className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedRole ? `Create ${getRoleTitle(selectedRole)} Account` : "Create Your Account"}
              </span>
            </div>

            {/* Signup Card */}
            <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-strong pointer-events-auto">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold">
                  Join <span className="bg-gradient-primary bg-clip-text text-transparent">Lab2Home</span>
                </CardTitle>
                <CardDescription className="text-base">
                  {selectedRole
                    ? `Complete your ${getRoleTitle(selectedRole).toLowerCase()} registration`
                    : "Start your journey to better health at home"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!selectedRole ? (
                  <RoleSelection onSelectRole={handleRoleSelect} />
                ) : (
                  <RoleBasedForm key={selectedRole} role={selectedRole} onBack={handleBackToRoleSelection} />
                )}

                {/* Login Link */}
                {selectedRole && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-primary font-medium hover:underline hover:text-primary/80 transition-colors"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}

                {/* Back to Home */}
                <div className="mt-4 text-center">
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-xs text-muted-foreground">Secure</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-health mb-1">AI</div>
                <div className="text-xs text-muted-foreground">Powered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-slow -z-10" />
      </section>

      <Footer />
    </div>
  );
};

export default Signup;
