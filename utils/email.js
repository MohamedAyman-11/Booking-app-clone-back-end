const nodemailer = require('nodemailer');
class Email {
  constructor(user, url) {
    this.email = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `Booking Clone <${process.env.EMAIL_FROM}>`;
    this.url = url;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }
  async sendEmail(template, subject) {
    const mailOptions = {
      to: this.email,
      from: this.from,
      subject: subject,
      html: template,
    };
    await this.newTransport().sendMail(mailOptions);
  }
}

module.exports = Email;
