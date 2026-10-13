const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { passcode, to, subject, text, filename, pdf } = req.body || {};

  if (!process.env.SEND_PASSCODE || passcode !== process.env.SEND_PASSCODE) {
    return res.status(401).json({ error: 'Wrong passcode' });
  }
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return res.status(400).json({ error: 'Invalid client email' });
  }
  if (pdf && pdf.length > 4000000) {
    return res.status(413).json({ error: 'PDF too large' });
  }

  const clean = (v) => String(v || '').replace(/[\r\n]+/g, ' ').slice(0, 200);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${clean(process.env.FROM_NAME || 'JalbinX')}" <${process.env.GMAIL_USER}>`,
      to,
      replyTo: process.env.GMAIL_USER,
      subject: clean(subject) || 'Invoice',
      text: String(text || '').slice(0, 5000),
      attachments: pdf
        ? [{ filename: clean(filename) || 'invoice.pdf', content: pdf, encoding: 'base64', contentType: 'application/pdf' }]
        : [],
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Gmail refused to send. Check GMAIL_USER and GMAIL_APP_PASSWORD.' });
  }
};
