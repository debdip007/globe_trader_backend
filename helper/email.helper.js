const nodemailer = require('nodemailer');

// Configure transporter (Brevo SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true if you use port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const EmailHelper = {
  /**
   * Send an email
   * @param {string|string[]} to - Recipient email(s)
   * @param {string} subject - Email subject
   * @param {string} html - Email body (HTML)
   * @param {string} [text] - Plain text fallback
   * @param {Array} [attachments] - Array of attachment objects
   */
  async sendMail(to, subject, html, text = '', attachments = []) {
    try {
      const info = await transporter.sendMail({
        from: '"Globe Trader" <Info@quantamo.com>', // sender address
        to,
        subject,
        text,
        html,
        attachments // e.g. [{ filename: 'file.pdf', path: './file.pdf' }]
      });

      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email send error:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = {EmailHelper};