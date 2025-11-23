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

