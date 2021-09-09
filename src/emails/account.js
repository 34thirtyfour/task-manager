const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email,name) => {
    sgMail.send({
        to: email,
        from:'rajputharvi@gmail.com',
        subject:'Thanks for joining in!',
        text: 'Welcome to the app '+ name +'. Welcome'
    })
}

module.exports={
    sendWelcomeMail
}