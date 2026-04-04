import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.routes';
import Patient from '../../models/Patient';
import Lab from '../../models/Lab';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock email service
jest.mock('../../services/email.service', () => ({
  sendOTPEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

describe('UC-4: Log In (Unified Login)', () => {
    // Shared user details
    const validPassword = 'Password123!';
    const validPatientData = {
        fullName: 'Login Patient',
        email: 'login.patient@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-01-01',
        age: 34,
        address: '123 Main St',
        password: validPassword,
        isVerified: true,
        isActive: true,
    };

    const validLabData = {
        fullName: 'Login Lab',
        email: 'login.lab@example.com',
        phone: '+0987654321',
        labName: 'Login Diagnostics',
        labAddress: '456 Lab St.',
        password: validPassword,
        isVerified: true,
        isActive: true,
        hasConfiguredTests: true,
        license: {
            data: Buffer.from('fake pdf'),
            contentType: 'application/pdf',
            filename: 'license.pdf',
            size: 15
        }
    };

    beforeEach(async () => {
        // Pre-create patients for testing
        const patient = new Patient(validPatientData);
        await patient.save(); // Utilizing mongoose pre-save hook to hash password

        const unverifiedPatient = new Patient({
            ...validPatientData,
            email: 'unverified.patient@example.com',
            isVerified: false,
        });
        await unverifiedPatient.save();

        const inactivePatient = new Patient({
            ...validPatientData,
            email: 'inactive.patient@example.com',
            isActive: false,
        });
        await inactivePatient.save();

        const lab = new Lab(validLabData);
        await lab.save();
    });

    describe('Patient Login', () => {
        it('should successfully log in a verified and active patient', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validPatientData.email,
                    password: validPassword,
                    role: 'patient'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.userType).toBe('patient');
        });

        it('should fail login if the password is incorrect', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validPatientData.email,
                    password: 'WrongPassword!',
                    role: 'patient'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should fail login if the patient is unverified', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'unverified.patient@example.com',
                    password: validPassword,
                    role: 'patient'
                });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Please verify your email first');
            expect(response.body.needsVerification).toBe(true);
        });

        it('should fail login if the patient is inactive/suspended', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'inactive.patient@example.com',
                    password: validPassword,
                    role: 'patient'
                });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('deactivated');
        });
    });

    describe('Lab Login', () => {
        it('should successfully log in a verified and active lab', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validLabData.email,
                    password: validPassword,
                    role: 'lab'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.userType).toBe('lab');
        });
    });

    describe('Role and General Validation', () => {
        it('should fail if an invalid role is provided', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validPatientData.email,
                    password: validPassword,
                    role: 'unknown_role'
                });

            expect(response.status).toBe(400); // Bad Request for unknown role
            expect(response.body.success).toBe(false);
        });

        it('should fail if email is empty or missing', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: validPassword,
                    role: 'patient'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
});
