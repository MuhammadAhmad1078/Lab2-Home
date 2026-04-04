import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import Patient from '../../models/Patient';
import OTP from '../../models/OTP';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock email service
jest.mock('../../services/email.service', () => ({
  sendOTPEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendAdminNotification: jest.fn()
}));

describe('UC-1: Patient Registration / Signup', () => {
    const validPatientData = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        age: 34,
        address: '123 Main St',
        password: 'Password123!'
    };

    it('should successfully register a new patient and send OTP', async () => {
        const response = await request(app)
            .post('/api/auth/signup/patient')
            .send(validPatientData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('Signup successful');

        // Verify patient created in DB
        const patient = await Patient.findOne({ email: validPatientData.email });
        expect(patient).toBeTruthy();
        expect(patient?.isVerified).toBe(false);

        // Verify OTP created
        const otpRecord = await OTP.findOne({ email: validPatientData.email, purpose: 'signup' });
        expect(otpRecord).toBeTruthy();
    });

    it('should fail registration if required fields are missing', async () => {
        const incompleteData = {
            fullName: 'Jane Doe',
            email: 'jane@example.com'
            // Missing password, phone, etc.
        };

        const response = await request(app)
            .post('/api/auth/signup/patient')
            .send(incompleteData);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should resend OTP if the user exists but is not verified', async () => {
        // Pre-create an unverified patient
        await Patient.create({
            ...validPatientData,
            email: 'unverified@example.com',
            isVerified: false
        });

        const response = await request(app)
            .post('/api/auth/signup/patient')
            .send({
                ...validPatientData,
                email: 'unverified@example.com'
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('Account exists but not verified');

        // Check new OTP
        const otpCount = await OTP.countDocuments({ email: 'unverified@example.com', purpose: 'signup' });
        expect(otpCount).toBe(1); // Should have replaced old ones
    });

    it('should fail if email is already registered and verified', async () => {
        // Pre-create a verified patient
        await Patient.create({
            ...validPatientData,
            email: 'verified@example.com',
            isVerified: true
        });

        const response = await request(app)
            .post('/api/auth/signup/patient')
            .send({
                ...validPatientData,
                email: 'verified@example.com'
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email already registered');
    });
});
