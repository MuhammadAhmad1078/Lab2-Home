import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import Phlebotomist from '../../models/Phlebotomist';
import OTP from '../../models/OTP';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock email service
jest.mock('../../services/email.service', () => ({
  sendOTPEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendAdminNotification: jest.fn(),
  sendAdminPhlebotomistNotification: jest.fn()
}));

describe('UC-3: Phlebotomist Registration / Signup', () => {
    const validData = {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        qualification: 'Certified Phlebotomist Technician (CPT)',
        password: 'Password123!'
    };

    it('should successfully register a new phlebotomist and send OTP', async () => {
        const response = await request(app)
            .post('/api/auth/signup/phlebotomist')
            .field('fullName', validData.fullName)
            .field('email', validData.email)
            .field('phone', validData.phone)
            .field('qualification', validData.qualification)
            .field('password', validData.password)
            .attach('trafficLicenseCopy', Buffer.from('fake image content'), 'license.jpg');

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        // Verify phlebotomist created in DB
        const phlebotomist = await Phlebotomist.findOne({ email: validData.email });
        expect(phlebotomist).toBeTruthy();
        expect(phlebotomist?.isVerified).toBe(false);
        expect(phlebotomist?.trafficLicense?.filename).toBe('license.jpg');

        // Verify OTP created
        const otpRecord = await OTP.findOne({ email: validData.email, purpose: 'signup' });
        expect(otpRecord).toBeTruthy();
    });

    it('should fail registration if traffic license file is missing', async () => {
        const response = await request(app)
            .post('/api/auth/signup/phlebotomist')
            .send(validData); // No file attached

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Traffic license copy is required');
    });

    it('should fail registration if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/auth/signup/phlebotomist')
            .field('email', 'incomplete@example.com')
            .attach('trafficLicenseCopy', Buffer.from('fake image content'), 'license.jpg');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should resend OTP and update info if the phlebotomist exists but is not verified', async () => {
        // Pre-create an unverified phlebotomist
        await Phlebotomist.create({
            ...validData,
            email: 'unverified-phleb@example.com',
            isVerified: false,
            trafficLicense: {
                data: Buffer.from('fake image content'),
                contentType: 'image/jpeg',
                filename: 'old_license.jpg',
                size: 16
            }
        });

        const response = await request(app)
            .post('/api/auth/signup/phlebotomist')
            .field('fullName', 'Updated Jane')
            .field('email', 'unverified-phleb@example.com')
            .field('phone', validData.phone)
            .field('qualification', validData.qualification)
            .field('password', validData.password)
            .attach('trafficLicenseCopy', Buffer.from('fake new file'), 'new_license.jpg');

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Account exists but not verified');

        // Check if info updated
        const phlebotomist = await Phlebotomist.findOne({ email: 'unverified-phleb@example.com' });
        expect(phlebotomist?.fullName).toBe('Updated Jane');
        expect(phlebotomist?.trafficLicense?.filename).toBe('new_license.jpg');
    });

    it('should fail if email is already registered and verified', async () => {
        // Pre-create a verified phlebotomist
        await Phlebotomist.create({
            ...validData,
            email: 'verified-phleb@example.com',
            isVerified: true,
            trafficLicense: {
                data: Buffer.from('fake image content'),
                contentType: 'image/jpeg',
                filename: 'license.jpg',
                size: 16
            }
        });

        const response = await request(app)
            .post('/api/auth/signup/phlebotomist')
            .field('fullName', validData.fullName)
            .field('email', 'verified-phleb@example.com')
            .field('phone', validData.phone)
            .field('qualification', validData.qualification)
            .field('password', validData.password)
            .attach('trafficLicenseCopy', Buffer.from('fake image content'), 'license.jpg');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already registered');
    });
});
