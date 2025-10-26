import formData from 'form-data';
import Mailgun from 'mailgun.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, and either text or html'
      });
    }

    // Read environment variables
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    const mailFrom = process.env.MAIL_FROM;

    if (!mailgunApiKey || !mailgunDomain || !mailFrom) {
      console.error('Missing Mailgun configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize Mailgun
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: 'api',
      key: mailgunApiKey
    });

    // Send email
    const messageData = {
      from: mailFrom,
      to: to,
      subject: subject,
      text: text || '',
      html: html || ''
    };

    const result = await mg.messages.create(mailgunDomain, messageData);

    console.log('Email sent successfully');
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      id: result.id
    });

  } catch (error) {
    console.error('Email send failed:', error.message);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}
