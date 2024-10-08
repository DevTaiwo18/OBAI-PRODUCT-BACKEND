const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Use an environment variable or a configuration setting to choose the email service
const useSendGrid = process.env.USE_SENDGRID === 'true';

const getCredentials = () => ({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});

// Add SendGrid API Key
if (useSendGrid) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const setTemplate = (logo, title, name, text, otp, link, buttonText) => {
    return `<!DOCTYPE html>
  <html>
  <head>
  <title>${title}</title>
  </head>
  <body style="background-color: #F5F5F5; color: #333; font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background: #FFF; border: 1px solid #ddd;">
      <tr>
        <td style="background-color: #CA1701; padding: 10px; text-align: center; border-bottom: 3px solid #CA1701;">
          <img src="${logo}" alt="Logo" style="max-width: 200px; border: 0;">
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h1 style="color: #CA1701;">${title}?</h1>
          <h3>Your One Time Password (OTP)</h3>
          <p style="color: #333; font-family: Arial, sans-serif;">Hey <span style="color: #CA1701; font-weight: bold;">${name}</span>, ${text}</p>
          <p style="font-size: 25px; text-decoration: underline; background: #F5F5F5; padding: 8px; font-weight: bold; color: #CA1701; margin: 20px 0;">${otp}</p>
          <p style="color: #333; font-family: Arial, sans-serif;">If you did not request a password reset, please ignore this email or <a href="mailto:support@email.com" style="color: #CA1701; text-decoration: none;">contact support</a>.</p>
        </td>${buttonText + link}
      </tr>
      <tr>
        <td style="background-color: #F5F5F5; color: #333; padding: 10px; font-size: 12px; text-align: center;">
          &copy; Ropstam. All rights reserved.
          <br>
          <a href="your-privacy-policy-url" style="color: #CA1701; text-decoration: none;">Privacy Policy</a> | <a href="your-terms-url" style="color: #CA1701; text-decoration: none;">Terms of Conditions</a>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

const sendEmail = async (emailDetails) => {
    if (useSendGrid) {
        // Use SendGrid to send the email
        try {
            await sgMail.send(emailDetails);
        } catch (error) {
            throw new Error('Error sending email');
        }
    } else {
        // Use Nodemailer to send the email
        try {
            const transporter = nodemailer.createTransport(getCredentials());
            await transporter.sendMail(emailDetails);
        } catch (error) {
            throw new Error('Error sending email');
        }
    }
};

const sendEmailToUserWithOTP = async (userEmail, otpCode) => {
    const html = setTemplate(/* parameters for your template */);
    const emailDetails = {
        from: process.env.SMTP_MAIL,
        to: userEmail,
        subject: 'Email Verification',
        html
    };

    await sendEmail(emailDetails);
};

// Similarly update sendEmailToUserWithPassword and sendEmailToNewlyVerifiedUser

const MAIL_HANDLER = {
    sendEmailToUserWithOTP
};

module.exports = MAIL_HANDLER;
