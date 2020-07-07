const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.FROM_EMAIL_ADDRESS,
        subject: 'Thanks for joining in!!',
        text: 'Welcome to the app ${name}, let us know how you get along.'
    });
};

module.exports = {
    sendWelcomeEmail
};
