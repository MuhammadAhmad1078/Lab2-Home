import { Request, Response } from 'express';
import Patient from '../models/Patient';
import Lab from '../models/Lab';
import Phlebotomist from '../models/Phlebotomist';
import OTP from '../models/OTP';
import { generateToken } from '../utils/jwt.util';
import { sendOTPEmail, sendWelcomeEmail } from '../services/email.service';

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============================================
// PATIENT SIGNUP (Step 1: Send OTP)
// ============================================
export const patientSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, dateOfBirth, address, password } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phone || !dateOfBirth || !address || !password) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }
    
    // Check if email already exists
    const existingPatient = await Patient.findOne({ email: email.toLowerCase() });
    if (existingPatient) {
      res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }
    
    // Create new patient (unverified)
    const patient = new Patient({
      fullName,
      email: email.toLowerCase(),
      phone,
      dateOfBirth: new Date(dateOfBirth),
      address,
      password,
      isVerified: false,
    });
    
    await patient.save();
    
    // Generate and save OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      purpose: 'signup',
    });
    
    // Send OTP email
    await sendOTPEmail(email, otp, fullName);
    
    res.status(201).json({
      success: true,
      message: 'Signup successful! Please check your email for OTP verification.',
      data: {
        email: email.toLowerCase(),
        message: 'OTP sent to your email. Valid for 10 minutes.',
      },
    });
  } catch (error: any) {
    console.error('Patient signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message,
    });
  }
};

// ============================================
// LAB SIGNUP (Step 1: Send OTP)
// ============================================
export const labSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, labName, licenseNumber, labAddress, password } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phone || !labName || !licenseNumber || !labAddress || !password) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }
    
    // Check if email already exists
    const existingLab = await Lab.findOne({ email: email.toLowerCase() });
    if (existingLab) {
      res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }
    
    // Check if license number already exists
    const existingLicense = await Lab.findOne({ licenseNumber });
    if (existingLicense) {
      res.status(400).json({
        success: false,
        message: 'License number already registered',
      });
      return;
    }
    
    // Create new lab (unverified)
    const lab = new Lab({
      fullName,
      email: email.toLowerCase(),
      phone,
      labName,
      licenseNumber,
      labAddress,
      password,
      isVerified: false,
    });
    
    await lab.save();
    
    // Generate and save OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      purpose: 'signup',
    });
    
    // Send OTP email
    await sendOTPEmail(email, otp, fullName);
    
    res.status(201).json({
      success: true,
      message: 'Signup successful! Please check your email for OTP verification.',
      data: {
        email: email.toLowerCase(),
        message: 'OTP sent to your email. Valid for 10 minutes.',
      },
    });
  } catch (error: any) {
    console.error('Lab signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message,
    });
  }
};

// ============================================
// PHLEBOTOMIST SIGNUP (Step 1: Send OTP)
// ============================================
export const phlebotomistSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, qualification, password } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Traffic license copy is required',
      });
      return;
    }
    
    // Validate required fields
    if (!fullName || !email || !phone || !qualification || !password) {
      res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      return;
    }
    
    // Check if email already exists
    const existingPhlebotomist = await Phlebotomist.findOne({ email: email.toLowerCase() });
    if (existingPhlebotomist) {
      res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
      return;
    }
    
    // Create new phlebotomist (unverified) with file stored in MongoDB
    const phlebotomist = new Phlebotomist({
      fullName,
      email: email.toLowerCase(),
      phone,
      qualification,
      trafficLicense: {
        data: req.file.buffer, // File binary data stored in MongoDB
        contentType: req.file.mimetype,
        filename: req.file.originalname,
        size: req.file.size,
      },
      password,
      isVerified: false,
    });
    
    await phlebotomist.save();
    
    console.log(`✅ Phlebotomist created with traffic license stored in database (${req.file.size} bytes)`);
    
    // Generate and save OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      purpose: 'signup',
    });
    
    // Send OTP email
    await sendOTPEmail(email, otp, fullName);
    
    res.status(201).json({
      success: true,
      message: 'Signup successful! Please check your email for OTP verification.',
      data: {
        email: email.toLowerCase(),
        message: 'OTP sent to your email. Valid for 10 minutes.',
      },
    });
  } catch (error: any) {
    console.error('Phlebotomist signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message,
    });
  }
};

// ============================================
// VERIFY OTP (Step 2: Verify and Activate Account)
// ============================================
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, userType } = req.body; // userType: 'patient' or 'lab'
    
    if (!email || !otp || !userType) {
      res.status(400).json({
        success: false,
        message: 'Email, OTP, and user type are required',
      });
      return;
    }
    
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      purpose: 'signup',
      expiresAt: { $gt: new Date() },
    });
    
    if (!otpRecord) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
      return;
    }
    
    // Verify and activate account based on user type
    if (userType === 'phlebotomist') {
      const phlebotomist = await Phlebotomist.findOne({ email: email.toLowerCase() });
      if (!phlebotomist) {
        res.status(404).json({
          success: false,
          message: 'Phlebotomist not found',
        });
        return;
      }
      
      phlebotomist.isVerified = true;
      await phlebotomist.save();
      
      // Send welcome email
      await sendWelcomeEmail(email, phlebotomist.fullName, 'Phlebotomist');
      
      // Generate JWT token
      const token = generateToken({
        id: phlebotomist._id.toString(),
        email: phlebotomist.email,
        userType: 'phlebotomist',
      });
      
      // Delete OTP after successful verification
      await OTP.deleteOne({ _id: otpRecord._id });
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully! Welcome to Lab2Home!',
        data: {
          token,
          user: {
            id: phlebotomist._id,
            fullName: phlebotomist.fullName,
            email: phlebotomist.email,
            phone: phlebotomist.phone,
            qualification: phlebotomist.qualification,
            userType: 'phlebotomist',
          },
        },
      });
    } else if (userType === 'patient') {
      const patient = await Patient.findOne({ email: email.toLowerCase() });
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        });
        return;
      }
      
      patient.isVerified = true;
      await patient.save();
      
      // Send welcome email
      await sendWelcomeEmail(email, patient.fullName, 'Patient');
      
      // Generate JWT token
      const token = generateToken({
        id: patient._id.toString(),
        email: patient.email,
        userType: 'patient',
      });
      
      // Delete OTP after successful verification
      await OTP.deleteOne({ _id: otpRecord._id });
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully! Welcome to Lab2Home!',
        data: {
          token,
          user: {
            id: patient._id,
            fullName: patient.fullName,
            email: patient.email,
            phone: patient.phone,
            userType: 'patient',
          },
        },
      });
    } else if (userType === 'lab') {
      const lab = await Lab.findOne({ email: email.toLowerCase() });
      if (!lab) {
        res.status(404).json({
          success: false,
          message: 'Lab not found',
        });
        return;
      }
      
      lab.isVerified = true;
      await lab.save();
      
      // Send welcome email
      await sendWelcomeEmail(email, lab.fullName, 'Lab');
      
      // Generate JWT token
      const token = generateToken({
        id: lab._id.toString(),
        email: lab.email,
        userType: 'lab',
      });
      
      // Delete OTP after successful verification
      await OTP.deleteOne({ _id: otpRecord._id });
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully! Welcome to Lab2Home!',
        data: {
          token,
          user: {
            id: lab._id,
            fullName: lab.fullName,
            email: lab.email,
            labName: lab.labName,
            phone: lab.phone,
            userType: 'lab',
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user type',
      });
    }
  } catch (error: any) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message,
    });
  }
};

// ============================================
// RESEND OTP
// ============================================
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, userType } = req.body;
    
    if (!email || !userType) {
      res.status(400).json({
        success: false,
        message: 'Email and user type are required',
      });
      return;
    }
    
    // Check if user exists
    let user;
    let name = '';
    
    if (userType === 'patient') {
      user = await Patient.findOne({ email: email.toLowerCase() });
      if (user) name = user.fullName;
    } else if (userType === 'lab') {
      user = await Lab.findOne({ email: email.toLowerCase() });
      if (user) name = user.fullName;
    } else if (userType === 'phlebotomist') {
      user = await Phlebotomist.findOne({ email: email.toLowerCase() });
      if (user) name = user.fullName;
    }
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }
    
    if (user.isVerified) {
      res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
      return;
    }
    
    // Delete old OTP
    await OTP.deleteMany({ email: email.toLowerCase(), purpose: 'signup' });
    
    // Generate new OTP
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      purpose: 'signup',
    });
    
    // Send OTP email
    await sendOTPEmail(email, otp, name);
    
    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      data: {
        email: email.toLowerCase(),
        message: 'New OTP sent to your email. Valid for 10 minutes.',
      },
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message,
    });
  }
};

// ============================================
// UNIFIED LOGIN (Automatically detects Patient or Lab)
// ============================================
export const unifiedLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }
    
    // Try to find in Patient collection first
    let patient = await Patient.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (patient) {
      // Found as patient
      if (!patient.isVerified) {
        res.status(403).json({
          success: false,
          message: 'Please verify your email first',
          needsVerification: true,
        });
        return;
      }
      
      if (!patient.isActive) {
        res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
        return;
      }
      
      // Verify password
      const isPasswordCorrect = await patient.comparePassword(password);
      if (!isPasswordCorrect) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }
      
      // Generate token for patient
      const token = generateToken({
        id: patient._id.toString(),
        email: patient.email,
        userType: 'patient',
      });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: patient._id,
            fullName: patient.fullName,
            email: patient.email,
            phone: patient.phone,
            address: patient.address,
            healthScore: patient.healthScore,
            userType: 'patient',
          },
        },
      });
      return;
    }
    
    // Not found in Patient, try Lab collection
    let lab = await Lab.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (lab) {
      // Found as lab
      if (!lab.isVerified) {
        res.status(403).json({
          success: false,
          message: 'Please verify your email first',
          needsVerification: true,
        });
        return;
      }
      
      if (!lab.isActive) {
        res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
        return;
      }
      
      // Verify password
      const isPasswordCorrect = await lab.comparePassword(password);
      if (!isPasswordCorrect) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }
      
      // Generate token for lab
      const token = generateToken({
        id: lab._id.toString(),
        email: lab.email,
        userType: 'lab',
      });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: lab._id,
            fullName: lab.fullName,
            email: lab.email,
            phone: lab.phone,
            labName: lab.labName,
            labAddress: lab.labAddress,
            licenseNumber: lab.licenseNumber,
            userType: 'lab',
          },
        },
      });
      return;
    }
    
    // Not found in Patient or Lab, try Phlebotomist collection
    let phlebotomist = await Phlebotomist.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (phlebotomist) {
      // Found as phlebotomist
      if (!phlebotomist.isVerified) {
        res.status(403).json({
          success: false,
          message: 'Please verify your email first',
          needsVerification: true,
        });
        return;
      }
      
      if (!phlebotomist.isActive) {
        res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.',
        });
        return;
      }
      
      // Verify password
      const isPasswordCorrect = await phlebotomist.comparePassword(password);
      if (!isPasswordCorrect) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }
      
      // Generate token for phlebotomist
      const token = generateToken({
        id: phlebotomist._id.toString(),
        email: phlebotomist.email,
        userType: 'phlebotomist',
      });
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: phlebotomist._id,
            fullName: phlebotomist.fullName,
            email: phlebotomist.email,
            phone: phlebotomist.phone,
            qualification: phlebotomist.qualification,
            userType: 'phlebotomist',
          },
        },
      });
      return;
    }
    
    // Not found in any collection
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    
  } catch (error: any) {
    console.error('Unified login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ============================================
// PATIENT LOGIN (Legacy - kept for compatibility)
// ============================================
export const patientLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }
    
    // Find patient with password field
    const patient = await Patient.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!patient) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }
    
    // Check if verified
    if (!patient.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        needsVerification: true,
      });
      return;
    }
    
    // Check if active
    if (!patient.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
      return;
    }
    
    // Verify password
    const isPasswordCorrect = await patient.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }
    
    // Generate token
    const token = generateToken({
      id: patient._id.toString(),
      email: patient.email,
      userType: 'patient',
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
          healthScore: patient.healthScore,
          userType: 'patient',
        },
      },
    });
  } catch (error: any) {
    console.error('Patient login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ============================================
// LAB LOGIN (Legacy - kept for compatibility)
// ============================================
export const labLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }
    
    // Find lab with password field
    const lab = await Lab.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!lab) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }
    
    // Check if verified
    if (!lab.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Please verify your email first',
        needsVerification: true,
      });
      return;
    }
    
    // Check if active
    if (!lab.isActive) {
      res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
      return;
    }
    
    // Verify password
    const isPasswordCorrect = await lab.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }
    
    // Generate token
    const token = generateToken({
      id: lab._id.toString(),
      email: lab.email,
      userType: 'lab',
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: lab._id,
          fullName: lab.fullName,
          email: lab.email,
          phone: lab.phone,
          labName: lab.labName,
          labAddress: lab.labAddress,
          licenseNumber: lab.licenseNumber,
          userType: 'lab',
        },
      },
    });
  } catch (error: any) {
    console.error('Lab login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// ============================================
// GET CURRENT USER
// ============================================
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }
    
    if (req.user.userType === 'phlebotomist') {
      const phlebotomist = await Phlebotomist.findById(req.user.id);
      if (!phlebotomist) {
        res.status(404).json({
          success: false,
          message: 'Phlebotomist not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          id: phlebotomist._id,
          fullName: phlebotomist.fullName,
          email: phlebotomist.email,
          phone: phlebotomist.phone,
          qualification: phlebotomist.qualification,
          availability: phlebotomist.availability,
          trafficLicenseInfo: {
            filename: phlebotomist.trafficLicense.filename,
            size: phlebotomist.trafficLicense.size,
            contentType: phlebotomist.trafficLicense.contentType,
          },
          userType: 'phlebotomist',
        },
      });
    } else if (req.user.userType === 'patient') {
      const patient = await Patient.findById(req.user.id);
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Patient not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
          dateOfBirth: patient.dateOfBirth,
          healthScore: patient.healthScore,
          userType: 'patient',
        },
      });
    } else if (req.user.userType === 'lab') {
      const lab = await Lab.findById(req.user.id);
      if (!lab) {
        res.status(404).json({
          success: false,
          message: 'Lab not found',
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          id: lab._id,
          fullName: lab.fullName,
          email: lab.email,
          phone: lab.phone,
          labName: lab.labName,
          labAddress: lab.labAddress,
          licenseNumber: lab.licenseNumber,
          userType: 'lab',
        },
      });
    }
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: error.message,
    });
  }
};
