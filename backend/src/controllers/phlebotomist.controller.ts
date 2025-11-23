import { Request, Response } from 'express';
import Phlebotomist from '../models/Phlebotomist';

// ============================================
// GET TRAFFIC LICENSE FILE
// ============================================
export const getTrafficLicense = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.userType !== 'phlebotomist') {
      res.status(403).json({
        success: false,
        message: 'Access denied. Only phlebotomists can access their license.',
      });
      return;
    }
    
    const phlebotomist = await Phlebotomist.findById(req.user.id);
    
    if (!phlebotomist || !phlebotomist.trafficLicense) {
      res.status(404).json({
        success: false,
        message: 'Traffic license not found',
      });
      return;
    }
    
    // Set proper headers for file download
    res.set({
      'Content-Type': phlebotomist.trafficLicense.contentType,
      'Content-Disposition': `inline; filename="${phlebotomist.trafficLicense.filename}"`,
      'Content-Length': phlebotomist.trafficLicense.size,
    });
    
    // Send the file buffer
    res.send(phlebotomist.trafficLicense.data);
    
  } catch (error: any) {
    console.error('Get traffic license error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve traffic license',
      error: error.message,
    });
  }
};

// ============================================
// GET PHLEBOTOMIST DASHBOARD DATA
// ============================================
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.userType !== 'phlebotomist') {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }
    
    const phlebotomist = await Phlebotomist.findById(req.user.id).populate('assignedLab');
    
    if (!phlebotomist) {
      res.status(404).json({
        success: false,
        message: 'Phlebotomist not found',
      });
      return;
    }
    
    // Mock data for now - will be replaced with real appointments later
    res.status(200).json({
      success: true,
      data: {
        user: {
          fullName: phlebotomist.fullName,
          email: phlebotomist.email,
          phone: phlebotomist.phone,
          qualification: phlebotomist.qualification,
          availability: phlebotomist.availability,
        },
        stats: {
          todaysCollections: 0,
          completed: 0,
          remaining: 0,
          totalDistance: '0 km',
        },
        schedule: [], // Will be populated with real appointments
        completedToday: [],
      },
    });
    
  } catch (error: any) {
    console.error('Get phlebotomist dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

