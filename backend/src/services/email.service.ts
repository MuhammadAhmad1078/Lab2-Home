import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email function
export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Lab2Home <noreply@lab2home.com>',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error}`);
    throw new Error('Failed to send email');
  }
};

// OTP Email Template
export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<void> => {
  const subject = 'Verify Your Email - Lab2Home';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Lab2Home</h1>
          <p>Healthcare at Your Doorstep</p>
        </div>
        <div class="content">
          <h2>Hello ${name}! 👋</h2>
          <p>Thank you for signing up with Lab2Home. To complete your registration, please verify your email address.</p>
          
          <p><strong>Your OTP (One-Time Password) is:</strong></p>
          <div class="otp-box">${otp}</div>
          
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          
          <p>If you didn't create an account with Lab2Home, please ignore this email.</p>
          
          <div class="footer">
            <p>© 2025 Lab2Home. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

// Welcome Email Template
export const sendWelcomeEmail = async (email: string, name: string, role: string): Promise<void> => {
  const subject = 'Welcome to Lab2Home! 🎉';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Welcome to Lab2Home!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}! 🎉</h2>
          <p>Your email has been successfully verified, and your <strong>${role}</strong> account is now active!</p>
          
          <p>You can now:</p>
          <ul>
            ${role === 'patient' ? `
              <li>Book lab tests from home</li>
              <li>View your test reports</li>
              <li>Track your health score</li>
              <li>Schedule appointments</li>
            ` : `
              <li>Manage test appointments</li>
              <li>Upload test results</li>
              <li>Track daily operations</li>
              <li>Monitor performance metrics</li>
            `}
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Go to Dashboard</a>
          </div>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <div class="footer">
            <p>© 2025 Lab2Home. All rights reserved.</p>
            <p>Healthcare at Your Doorstep</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

// Booking Status Update Email Template
export const sendBookingStatusUpdateEmail = async (
  email: string,
  patientName: string,
  testName: string,
  status: string,
  bookingDate: string,
  timeSlot: string,
  labName: string
): Promise<void> => {
  const statusMessages: Record<string, { title: string; message: string; color: string }> = {
    confirmed: {
      title: 'Booking Confirmed ✅',
      message: 'Your test booking has been confirmed by the lab.',
      color: '#10b981'
    },
    'in-progress': {
      title: 'Sample Collection In Progress 🔬',
      message: 'Your sample is being collected. The lab will process it shortly.',
      color: '#3b82f6'
    },
    completed: {
      title: 'Test Completed ✨',
      message: 'Your test has been completed! Your report will be available soon.',
      color: '#8b5cf6'
    },
    cancelled: {
      title: 'Booking Cancelled ❌',
      message: 'Your test booking has been cancelled.',
      color: '#ef4444'
    }
  };

  const statusInfo = statusMessages[status] || {
    title: 'Status Updated',
    message: `Your booking status has been updated to: ${status}`,
    color: '#667eea'
  };

  const subject = `${statusInfo.title} - Lab2Home`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { display: inline-block; padding: 8px 16px; background: ${statusInfo.color}; color: white; border-radius: 20px; font-weight: bold; margin: 15px 0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusInfo.color}; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .info-label { font-weight: bold; color: #666; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Lab2Home</h1>
          <p>Healthcare at Your Doorstep</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName}! 👋</h2>
          <p>${statusInfo.message}</p>
          
          <div style="text-align: center;">
            <span class="status-badge">${statusInfo.title}</span>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: ${statusInfo.color};">Booking Details</h3>
            <div class="info-row">
              <span class="info-label">Test:</span>
              <span>${testName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Lab:</span>
              <span>${labName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span>${bookingDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Time:</span>
              <span>${timeSlot}</span>
            </div>
            <div class="info-row" style="border-bottom: none;">
              <span class="info-label">Status:</span>
              <span style="color: ${statusInfo.color}; font-weight: bold; text-transform: capitalize;">${status.replace('-', ' ')}</span>
            </div>
          </div>
          
          ${status === 'completed' ? `
            <p style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
              📊 <strong>Your report will be available in your dashboard soon!</strong>
            </p>
          ` : ''}
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/patient" 
               style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
              View Dashboard
            </a>
          </div>
          
          <p>If you have any questions, please contact the lab directly or reach out to our support team.</p>
          
          <div class="footer">
            <p>© 2025 Lab2Home. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

// Report Uploaded Email Template
export const sendReportUploadedEmail = async (
  email: string,
  patientName: string,
  testName: string,
  reportUrl: string,
  labName: string
): Promise<void> => {
  const subject = 'Your Test Report is Ready! 📄 - Lab2Home';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Lab2Home</h1>
          <p>Healthcare at Your Doorstep</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName}! 👋</h2>
          <p>Great news! Your test report for <strong>${testName}</strong> is now available.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #10b981;">Report Details</h3>
            <p><strong>Lab:</strong> ${labName}</p>
            <p><strong>Test:</strong> ${testName}</p>
            <p><strong>Status:</strong> Completed ✅</p>
          </div>
          
          <p>You can view and download your report by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${reportUrl}" class="button" target="_blank">View Report</a>
          </div>
          
          <p>Or log in to your dashboard to view all your reports.</p>
          
          <div style="text-align: center; margin-top: 10px;">
             <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/patient/reports" style="color: #667eea; text-decoration: none;">Go to Dashboard</a>
          </div>
          
          <div class="footer">
            <p>© 2025 Lab2Home. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

// New Booking Email Template (for Lab)
export const sendNewBookingEmail = async (
  email: string,
  labName: string,
  patientName: string,
  testName: string,
  bookingDate: string,
  timeSlot: string
): Promise<void> => {
  const subject = 'New Booking Received! 📅 - Lab2Home';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 Lab2Home</h1>
          <p>Healthcare at Your Doorstep</p>
        </div>
        <div class="content">
          <h2>Hello ${labName}! 👋</h2>
          <p>You have received a new booking request!</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #667eea;">Booking Details</h3>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Test:</strong> ${testName}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
          </div>
          
          <p>Please log in to your dashboard to view details and manage this booking.</p>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/lab/appointments" class="button">View Booking</a>
          </div>
          
          <div class="footer">
            <p>© 2025 Lab2Home. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject, html });
};

