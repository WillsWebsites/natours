const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate 'less secure app' option for gmail
  })

  // Define the email options
  const mailOptions = {
    from: 'William Schaefermeyer <wschaefermeyer@swiftenergy.solar>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  // Send email with nodemailer
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
